"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { render } from "@react-email/render";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import React from "react";
import { InviteEmail } from "@/components/emails/InviteEmail";
import { db } from "@/lib/db/index";
import { invitations } from "@/lib/db/schema/index";
import { invitationSchema } from "@/lib/validation/Validations";

let transporter: Transporter;
try {
	transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_APP_PASSWORD,
		},
		connectionTimeout: 15000,
		greetingTimeout: 15000,
		socketTimeout: 15000,
	});
} catch (e) {
	console.error("Failed to create email transporter:", e);
	throw new Error(
		"Failed to configure email transport. Please contact support.",
	);
}

const _EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";

export async function sendUserInvitationAction(email: string, notes?: string) {
	try {
		const validationResult = invitationSchema.safeParse({ email, notes });
		if (!validationResult.success) {
			return {
				success: false,
				error:
					validationResult.error.issues[0]?.message ||
					"Invalid invitation data",
			};
		}

		const normalizedEmail = email.trim().toLowerCase();

		if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
			return {
				success: false,
				error:
					"Email service is not configured. Missing GMAIL_USER or GMAIL_APP_PASSWORD in server environment.",
			};
		}

		const dbUser = await getAuthenticatedDbUser();
		const user = await currentUser();

		const sanitizedNotes = notes
			? notes.replace(/^([\s\S]{0,100})[\s\S]*/, "$1").trim()
			: null;

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		// Check if an active pending invitation already exists for this email
		const existingPending = await db.query.invitations.findFirst({
			where: and(
				eq(invitations.email, normalizedEmail),
				eq(invitations.status, "pending"),
				gt(invitations.expiresAt, new Date()),
			),
		});

		let token: string;

		if (existingPending) {
			// Renew the existing invitation and reuse or generate token
			token = existingPending.token || nanoid(32);
			await db
				.update(invitations)
				.set({
					notes: sanitizedNotes,
					invitedById: dbUser.id,
					expiresAt,
					token,
				})
				.where(eq(invitations.id, existingPending.id));
		} else {
			token = nanoid(32);
			await db.insert(invitations).values({
				email: normalizedEmail,
				notes: sanitizedNotes,
				invitedById: dbUser.id,
				token,
				expiresAt,
				status: "pending",
			});
		}

		const teamName = "Projectnify";

		const rawAppUrl =
			process.env.NEXT_PUBLIC_APP_URL ||
			(process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3000");
		const appUrl = rawAppUrl.replace(/\/$/, "");
		const inviteUrl = `${appUrl}/invitation/${token}`;

		const emailHtml = await render(
			React.createElement(InviteEmail, {
				inviterName: user?.firstName || dbUser.name || "A teammate",
				acceptLink: inviteUrl,
				teamName,
				notes: sanitizedNotes,
			}),
		);

		const info = await transporter.sendMail({
			from: `"Projectnify" <${process.env.GMAIL_USER}>`,
			to: normalizedEmail,
			subject: `You have been invited to join ${teamName}`,
			html: emailHtml,
		});

		return {
			success: true,
			messageId: info.messageId,
			isResend: Boolean(existingPending),
		};
	} catch (err: unknown) {
		const errorMsg =
			err instanceof Error ? err.message : "Failed to send invitation.";
		console.error("sendUserInvitationAction Exception:", errorMsg);
		return {
			success: false,
			error: errorMsg,
		};
	}
}

export async function getInvitationByTokenAction(token: string) {
	try {
		const invitation = await db.query.invitations.findFirst({
			where: eq(invitations.token, token),
			with: {
				invitedBy: true,
			},
		});

		if (!invitation) return { success: false, reason: "Invitation not found." };

		if (invitation.status === "accepted")
			return { success: false, reason: "Invitation has already been used." };

		if (new Date() > new Date(invitation.expiresAt)) {
			if (invitation.status !== "expired") {
				await db
					.update(invitations)
					.set({ status: "expired" })
					.where(eq(invitations.id, invitation.id));
			}
			return { success: false, reason: "Invitation link has expired." };
		}

		return { success: true, invitation };
	} catch (err: unknown) {
		console.error("getInvitationByTokenAction Error:", err);
		return { success: false, reason: "Failed to verify invitation." };
	}
}

export async function respondToInvitation(
	token: string,
	action: "accept" | "decline",
) {
	try {
		const invite = await db.query.invitations.findFirst({
			where: and(
				eq(invitations.token, token),
				gt(invitations.expiresAt, new Date()),
			),
		});

		if (!invite) {
			return {
				success: false,
				error: "Invitation token is invalid or expired.",
			};
		}

		if (invite.status === "accepted") {
			return {
				success: false,
				error: "This invitation has already been accepted.",
			};
		}

		// Handle decline action (does not require login)
		if (action === "decline") {
			await db
				.update(invitations)
				.set({ status: "declined" })
				.where(eq(invitations.id, invite.id));

			revalidatePath("/team");
			return { success: true, status: "declined" };
		}

		// For accept action, user must be logged in
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				requiresAuth: true,
				error: "Please sign in to accept this invitation.",
			};
		}

		const _dbUser = await getAuthenticatedDbUser();

		await db
			.update(invitations)
			.set({ status: "accepted" })
			.where(eq(invitations.id, invite.id));

		revalidatePath("/team");
		return { success: true, status: "accepted" };
	} catch (err: unknown) {
		const errorMsg =
			err instanceof Error ? err.message : "Failed to respond to invitation.";
		console.error("respondToInvitation Error:", errorMsg);
		return {
			success: false,
			error: errorMsg,
		};
	}
}
