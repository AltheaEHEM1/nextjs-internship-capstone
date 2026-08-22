import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { teamMembers } from "@/lib/db/schema/index";
import { pusherServer } from "@/lib/real-time-board/PusherServer";

/**
 * Triggers a Pusher event to all members of a team.
 * @param teamId The ID of the team whose members should be notified.
 * @param eventName The Pusher event name.
 * @param payload The data to send with the event.
 * @param actorClerkId The clerk ID of the user performing the action (so they don't get notified of their own action).
 */
export async function notifyTeamMembers(
	teamId: string,
	eventName: string,
	payload: unknown,
	actorClerkId?: string,
) {
	try {
		if (!pusherServer) return;

		const members = await db.query.teamMembers.findMany({
			where: eq(teamMembers.teamId, teamId),
			with: {
				user: true,
			},
		});

		if (!members || members.length === 0) return;

		for (const member of members) {
			if (member.user?.clerkId) {
				if (member.user.clerkId === actorClerkId) {
					continue;
				}
				const channelName = `user-${member.user.clerkId}`;
				await pusherServer.trigger(channelName, eventName, payload);
			}
		}
	} catch (error) {
		console.error("Failed to notify team members:", error);
	}
}

export async function notifyUser(
	clerkId: string,
	eventName: string,
	payload: unknown,
) {
	try {
		if (!pusherServer) return;
		const channelName = `user-${clerkId}`;
		await pusherServer.trigger(channelName, eventName, payload);
	} catch (error) {
		console.error("Failed to notify user:", error);
	}
}
