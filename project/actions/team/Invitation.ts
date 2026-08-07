"use server";

import dns from "node:dns";
import { auth, currentUser } from "@clerk/nextjs/server";
import { render } from "@react-email/render";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import React from "react";
import { InviteEmail } from "@/components/emails/InviteEmail";
import { syncUser } from "@/lib/auth/sync-user";
import { db } from "@/lib/db";
import { invitations, teamMembers, users } from "@/lib/db/schema";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getAuthenticatedDbUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    let dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
    });

    if (!dbUser) {
        dbUser = (await syncUser()) ?? undefined;
    }

    if (!dbUser) throw new Error("User sync failed");
    return dbUser;
}

export async function sendUserInvitationAction(email: string, notes?: string) {
    try {
        const normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return {
                success: false,
                error: `"${email}" is not a valid email address.`,
            };
        }

        const dbUser = await getAuthenticatedDbUser();

        const existingPending = await db.query.invitations.findFirst({
            where: and(
                eq(invitations.email, normalizedEmail),
                eq(invitations.status, "pending"),
                gt(invitations.expiresAt, new Date()),
            ),
        });

        if (existingPending) {
            return {
                success: false,
                error: `An invitation is already pending for ${normalizedEmail}.`,
            };
        }

        const user = await currentUser();
        const token = nanoid(32);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const sanitizedNotes = notes
            ? notes.replace(/^([\s\S]{0,100})[\s\S]*/, "$1").trim()
            : null;

        await db.insert(invitations).values({
            email: normalizedEmail,
            notes: sanitizedNotes,
            invitedById: dbUser.id,
            token,
            expiresAt,
            status: "pending",
        });

        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${token}`;

        const emailHtml = await render(
            React.createElement(InviteEmail, {
                inviterName: user?.firstName || dbUser.name || "A teammate",
                acceptLink: inviteUrl,
                teamName: "Projectnify",
                notes: sanitizedNotes,
            }),
        );

        const info = await transporter.sendMail({
            from: `"Projectnify" <${process.env.GMAIL_USER}>`,
            to: normalizedEmail,
            subject: "You have been invited to join a team",
            html: emailHtml,
        });

        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        console.error("sendUserInvitationAction Exception:", err);
        return {
            success: false,
            error: err?.message || "Failed to send invitation.",
        };
    }
}

export async function getInvitationByTokenAction(token: string) {
    try {
        const invitation = await db.query.invitations.findFirst({
            where: eq(invitations.token, token),
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
    } catch (err: any) {
        console.error("getInvitationByTokenAction Error:", err);
        return { success: false, reason: "Failed to verify invitation." };
    }
}

export async function respondToInvitation(
    token: string,
    action: "accept" | "decline",
) {
    try {
        const dbUser = await getAuthenticatedDbUser();

        const invite = await db.query.invitations.findFirst({
            where: and(
                eq(invitations.token, token),
                gt(invitations.expiresAt, new Date()),
            ),
        });

        if (!invite)
            return {
                success: false,
                error: "Invitation token is invalid or expired.",
            };

        const newStatus = action === "accept" ? "accepted" : "declined";

        await db
            .update(invitations)
            .set({ status: newStatus })
            .where(eq(invitations.id, invite.id));

        if (action === "accept" && invite.teamId) {
            const existingMember = await db.query.teamMembers.findFirst({
                where: and(
                    eq(teamMembers.teamId, invite.teamId),
                    eq(teamMembers.userId, dbUser.id),
                ),
            });

            if (!existingMember) {
                await db.insert(teamMembers).values({
                    teamId: invite.teamId,
                    userId: dbUser.id,
                    role: "Member",
                    permission: "member",
                });
            }
        }

        revalidatePath("/team");

        return { success: true, status: newStatus };
    } catch (err: any) {
        console.error("respondToInvitation Error:", err);
        return {
            success: false,
            error: err?.message || "Failed to respond to invitation.",
        };
    }
}