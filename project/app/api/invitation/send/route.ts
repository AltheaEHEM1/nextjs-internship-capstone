import { currentUser } from "@clerk/nextjs/server";
import { render } from "@react-email/render";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import React from "react";
import { InviteEmail } from "@/components/emails/InviteEmail";
import { db } from "@/lib/db/index";
import { invitations } from "@/lib/db/schema/index";
import { invitationSchema } from "@/lib/validation/Validations";
import type { SendInvitationRequest } from "@/types/api/invitation";

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
}

/**
 * Internal helper — can be called by other route handlers (e.g. add-member flow)
 * without going through HTTP.
 */
export async function sendUserInvitationHandler(
	email: string,
	notes?: string,
	dbUser?: { id: string; name: string | null; clerkId: string | null },
) {
	const validationResult = invitationSchema.safeParse({ email, notes });
	if (!validationResult.success) {
		return {
			success: false,
			error:
				validationResult.error.issues[0]?.message || "Invalid invitation data",
		};
	}

	if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
		return {
			success: false,
			error:
				"Email service is not configured. Missing GMAIL_USER or GMAIL_APP_PASSWORD in server environment.",
		};
	}

	const normalizedEmail = email.trim().toLowerCase();
	const sanitizedNotes = notes
		? notes.replace(/^([\s\S]{0,100})[\s\S]*/, "$1").trim()
		: null;
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	let resolvedDbUser = dbUser;
	if (!resolvedDbUser) {
		const { getAuthenticatedDbUser } = await import("@/lib/auth/GetUser");
		resolvedDbUser = await getAuthenticatedDbUser();
	}

	const clerkUserInstance = await currentUser();

	const existingPending = await db.query.invitations.findFirst({
		where: and(
			eq(invitations.email, normalizedEmail),
			eq(invitations.status, "pending"),
			gt(invitations.expiresAt, new Date()),
		),
	});

	let token: string;

	if (existingPending) {
		token = existingPending.token || nanoid(32);
		await db
			.update(invitations)
			.set({
				notes: sanitizedNotes,
				invitedById: resolvedDbUser.id,
				expiresAt,
				token,
			})
			.where(eq(invitations.id, existingPending.id));
	} else {
		token = nanoid(32);
		await db.insert(invitations).values({
			email: normalizedEmail,
			notes: sanitizedNotes,
			invitedById: resolvedDbUser.id,
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
			inviterName:
				clerkUserInstance?.firstName || resolvedDbUser.name || "A teammate",
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
}

export async function POST(req: Request) {
	try {
		const data: SendInvitationRequest = await req.json();
		const result = await sendUserInvitationHandler(data.email, data.notes);
		if (!result.success) {
			return NextResponse.json(result, { status: 400 });
		}
		return NextResponse.json(result);
	} catch (err: unknown) {
		const errorMsg =
			err instanceof Error ? err.message : "Failed to send invitation.";
		console.error("POST /api/invitation/send Error:", errorMsg);
		return NextResponse.json(
			{ success: false, error: errorMsg },
			{ status: 500 },
		);
	}
}
