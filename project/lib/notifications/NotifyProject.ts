import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { projects } from "@/lib/db/schema/index";
import { pusherServer } from "@/lib/real-time-board/PusherServer";

/**
 * Triggers a Pusher event to all team members of a project.
 * @param projectId The ID of the project whose team members should be notified.
 * @param eventName The Pusher event name (e.g., "task-edited", "task-commented").
 * @param payload The data to send with the event.
 * @param actorClerkId The clerk ID of the user performing the action (so they don't get notified of their own action).
 */
export async function notifyProjectMembers(
	projectId: string,
	eventName: string,
	payload: unknown,
	actorClerkId?: string,
) {
	try {
		if (!pusherServer) return;

		// We need to find the project to get its teamId, and include the team members.
		const project = await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
			with: {
				team: {
					with: {
						members: {
							with: {
								user: true,
							},
						},
					},
				},
			},
		});

		if (!project?.team?.members) return;

		// Iterate through all members of the team
		for (const member of project.team.members) {
			if (member.user?.clerkId) {
				const channelName = `user-${member.user.clerkId}`;
				await pusherServer.trigger(channelName, eventName, payload);
			}
		}
	} catch (error) {
		console.error("Failed to notify project members:", error);
	}
}
