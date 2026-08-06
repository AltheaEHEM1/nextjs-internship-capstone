"use server";

import dns from "node:dns"; 
import { auth, currentUser } from "@clerk/nextjs/server";
import { render } from "@react-email/render";
import { and, eq, gt, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import React from "react";
import { TeamInviteEmail } from "@/components/emails/TeamInviteEmail";
import { syncUser } from "@/lib/auth/sync-user";
import { db } from "@/lib/db";
import { invitations, teamMembers, teams, users } from "@/lib/db/schema";

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

// 1. Send Standalone Invitation (Before Team Exists)
export async function sendUserInvitationAction(email: string) {
  try {
    const dbUser = await getAuthenticatedDbUser();
    const user = await currentUser();
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(invitations).values({
      email,
      invitedById: dbUser.id,
      token,
      expiresAt,
      status: "pending",
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${token}`;

    // Render React Email Component to HTML string
    const emailHtml = await render(
      React.createElement(TeamInviteEmail, {
        inviterName: user?.firstName || dbUser.name || "A teammate",
        acceptLink: inviteUrl,
        teamName: "Projectnify",
      })
    );

    // Send email via Nodemailer (Gmail SMTP)
    const info = await transporter.sendMail({
      from: `"Projectnify" <${process.env.GMAIL_USER}>`,
      to: email,
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

// 2. Accept or Reject Invitation
export async function respondToInvitation(
  token: string,
  action: "accept" | "reject",
) {
  try {
    await getAuthenticatedDbUser();

    const invite = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.token, token),
        gt(invitations.expiresAt, new Date()),
      ),
    });

    if (!invite) {
      return { success: false, error: "Invitation token is invalid or expired." };
    }

    const status = action === "accept" ? "accepted" : "rejected";

    await db
      .update(invitations)
      .set({ status })
      .where(eq(invitations.id, invite.id));

    revalidatePath("/team");
    return { success: true, status };
  } catch (err: any) {
    console.error("respondToInvitation Error:", err);
    return { success: false, error: err?.message || "Failed to respond to invitation." };
  }
}

// 3. Fetch list of people who accepted current user's invitations
export async function getAcceptedInvitesAction() {
  try {
    const dbUser = await getAuthenticatedDbUser();

    const acceptedList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
      })
      .from(invitations)
      .innerJoin(users, sql`LOWER(${users.email}) = LOWER(${invitations.email})`)
      .where(
        and(
          eq(invitations.invitedById, dbUser.id),
          eq(invitations.status, "accepted"),
        ),
      );

    return { success: true, data: acceptedList };
  } catch (err: any) {
    console.error("getAcceptedInvitesAction Error:", err);
    return { success: false, error: err?.message || "Failed to fetch accepted invites." };
  }
}

// 4. Create Team using Accepted Users
export async function createTeamWithMembersAction(data: {
  name: string;
  icon?: string;
  coverUrl?: string;
  members: Array<{
    userId: string;
    role: string;
    permission: "administrator" | "member" | "viewer";
  }>;
}) {
  try {
    const dbUser = await getAuthenticatedDbUser();

    return await db.transaction(async (tx) => {
      const [newTeam] = await tx
        .insert(teams)
        .values({
          name: data.name,
          icon: data.icon || "🚀",
          coverUrl: data.coverUrl || null,
        })
        .returning();

      // Add owner
      await tx.insert(teamMembers).values({
        teamId: newTeam.id,
        userId: dbUser.id,
        role: "Owner",
        permission: "administrator",
      });

      // Add selected accepted members
      if (data.members && data.members.length > 0) {
        await tx.insert(teamMembers).values(
          data.members.map((m) => ({
            teamId: newTeam.id,
            userId: m.userId,
            role: m.role || "Member",
            permission: m.permission || "member",
          })),
        );
      }

      revalidatePath("/team");
      return { success: true, teamId: newTeam.id };
    });
  } catch (err: any) {
    console.error("createTeamWithMembersAction Error:", err);
    return { success: false, error: err?.message || "Failed to create team." };
  }
}

// Get all Teams where current user is a member
export async function getUserTeamsAction() {
  try {
    const dbUser = await getAuthenticatedDbUser();
    const userTeams = await db
      .select({
        id: teams.id,
        name: teams.name,
        icon: teams.icon,
        coverUrl: teams.coverUrl,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, dbUser.id));

    const teamsWithCount = await Promise.all(
      userTeams.map(async (team) => {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(teamMembers)
          .where(eq(teamMembers.teamId, team.id));
        return { ...team, membersCount: count };
      }),
    );

    return { success: true, data: teamsWithCount };
  } catch (err: any) {
    console.error("getUserTeamsAction Error:", err);
    return { success: false, error: err?.message || "Failed to fetch user teams." };
  }
}


// Get Team Details with Member List
export async function getTeamDetailAction(teamId: string) {
  try {
    await getAuthenticatedDbUser();
    const targetTeam = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });
    if (!targetTeam) return { success: false, error: "Team not found" };

    const members = await db
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        role: teamMembers.role,
        permission: teamMembers.permission,
        name: users.name,
        email: users.email,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));

    return {
      success: true,
      data: {
        ...targetTeam,
        members,
      },
    };
  } catch (err: any) {
    console.error("getTeamDetailAction Error:", err);
    return { success: false, error: err?.message || "Failed to fetch team details." };
  }
}

// Delete Team
export async function deleteTeamAction(teamId: string) {
  try {
    const dbUser = await getAuthenticatedDbUser();
    const memberRecord = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, dbUser.id),
      ),
    });

    if (!memberRecord || memberRecord.permission !== "administrator") {
      return { success: false, error: "Only team administrators can delete this team." };
    }

    await db.delete(teams).where(eq(teams.id, teamId));
    revalidatePath("/team");
    return { success: true };
  } catch (err: any) {
    console.error("deleteTeamAction Error:", err);
    return { success: false, error: err?.message || "Failed to delete team." };
  }
}