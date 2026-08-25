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

let transporter: Transporter;
try {
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.example.com",
		port: Number(process.env.SMTP_PORT) || 587,
		secure: process.env.SMTP_SECURE === "true", // use true for 465, false for other ports (like 587)
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
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
	dbUser?: {
		id: string;
		name: string | null;
		email: string;
		clerkId: string | null;
	},
	teamId?: string,
) {
	const validationResult = invitationSchema.safeParse({ email, notes });
	if (!validationResult.success) {
		return {
			success: false,
			error:
				validationResult.error.issues[0]?.message || "Invalid invitation data",
		};
	}

	if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
		return {
			success: false,
			error:
				"Email service is not configured. Missing SMTP_USER or SMTP_PASS in server environment.",
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
				...(teamId ? { teamId } : {}),
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
			...(teamId ? { teamId } : {}),
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

	const inviterName =
		clerkUserInstance?.firstName || resolvedDbUser.name || "A teammate";
	const inviterEmail =
		clerkUserInstance?.emailAddresses?.[0]?.emailAddress ||
		resolvedDbUser.email;

	const emailHtml = await render(
		React.createElement(InviteEmail, {
			inviterName,
			inviterEmail,
			acceptLink: inviteUrl,
			teamName,
			notes: sanitizedNotes,
		}),
	);

	const info = await transporter.sendMail({
		from: `"${inviterName} via ${teamName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
		replyTo: inviterEmail,
		to: normalizedEmail,
		subject: `${inviterName} invited you to join ${teamName}`,
		html: emailHtml,
	});

	return {
		success: true,
		messageId: info.messageId,
		isReinvitation: Boolean(existingPending),
	};
}

export async function POST(req: Request) {
	try {
		const data = await req.json();
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
