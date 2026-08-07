"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { syncUser } from "@/lib/auth/sync-user";
import { db } from "@/lib/db";
import { teamMembers, teams, users } from "@/lib/db/schema";

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
            .where(and(eq(teamMembers.userId, dbUser.id), isNull(teams.deletedAt)));

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
        return {
            success: false,
            error: err?.message || "Failed to fetch user teams.",
        };
    }
}

export async function getTeamDetailAction(teamId: string) {
    try {
        await getAuthenticatedDbUser();

        const targetTeam = await db.query.teams.findFirst({
            where: and(eq(teams.id, teamId), isNull(teams.deletedAt)),
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
            data: { ...targetTeam, members },
        };
    } catch (err: any) {
        console.error("getTeamDetailAction Error:", err);
        return {
            success: false,
            error: err?.message || "Failed to fetch team details.",
        };
    }
}

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
            return {
                success: false,
                error: "Only team administrators can delete this team.",
            };
        }

        await db.update(teams).set({ deletedAt: new Date() }).where(eq(teams.id, teamId));
        revalidatePath("/team");

        return { success: true };
    } catch (err: any) {
        console.error("deleteTeamAction Error:", err);
        return { success: false, error: err?.message || "Failed to delete team." };
    }
}