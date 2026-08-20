"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useNotification } from "@/hooks/notification/useNotification";
import { useToast } from "@/hooks/toast/use-toast";
import { pusherClient } from "@/lib/pusher-client";

export function GlobalNotificationListener() {
	const { user } = useUser();
	const { toast } = useToast();
	const router = useRouter();
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user || !pusherClient) return;

		const channelName = `user-${user.id}`;
		const channel = pusherClient.subscribe(channelName);

		channel.bind(
			"task-assigned",
			(data: { taskTitle: string; assignerName: string }) => {
				const title = "New Task Assigned";
				const description = `${data.assignerName} assigned you to "${data.taskTitle}"`;

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"task-added",
			(data: { taskTitle: string; creatorName: string }) => {
				const title = "New Task Created";
				const description = `${data.creatorName} added a new task "${data.taskTitle}"`;

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"task-commented",
			(data: { taskTitle: string; commenterName: string }) => {
				const title = "New Comment on Task";
				const description = `${data.commenterName} commented on "${data.taskTitle}"`;

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"task-edited",
			(data: { taskTitle: string; editorName: string }) => {
				const title = "Task Edited";
				const description = `${data.editorName} edited "${data.taskTitle}"`;

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"task-deleted",
			(data: { taskTitle: string; deleterName: string }) => {
				const title = "Task Deleted";
				const description = `${data.deleterName} deleted the task "${data.taskTitle}"`;

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"project-deleted",
			(data: { projectName: string; deleterName: string }) => {
				const title = "Project Deleted";
				const description = `${data.deleterName} deleted the project "${data.projectName}"`;

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"team-member-added",
			(data: { teamId: string }) => {
				const title = "Team Member Added";
				const description = "A new member was added to your team.";

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"team-member-updated",
			(data: { teamId: string }) => {
				const title = "Team Member Updated";
				const description = "A member's role or access was updated.";

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		channel.bind(
			"team-member-removed",
			(data: { teamId: string }) => {
				const title = "Team Member Removed";
				const description = "A member was removed from your team.";

				addNotification({ title, description });

				toast({
					title,
					description,

				});
			},
		);

		return () => {
			pusherClient?.unsubscribe(channelName);
		};
	}, [user, toast, router, addNotification]);

	return null;
}
