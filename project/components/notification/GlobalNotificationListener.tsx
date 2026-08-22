"use client";

import { useUser } from "@clerk/nextjs";

import { useEffect } from "react";

import { useNotification } from "@/hooks/notification/useNotification";
import { useToast } from "@/hooks/toast/use-toast";
import { pusherClient } from "@/lib/real-time-board/PusherClient";

export function GlobalNotificationListener() {
	const { user } = useUser();
	const { toast } = useToast();

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
			"project-added",
			(data: { projectName: string; creatorName: string }) => {
				const title = "Added to Project";
				const description = `${data.creatorName} added your team to the project "${data.projectName}"`;

				addNotification({ title, description });

				toast({
					title,
					description,
				});
			},
		);

		channel.bind(
			"project-edited",
			(data: { projectName: string; editorName: string }) => {
				const title = "Project Edited";
				const description = `${data.editorName} edited the project "${data.projectName}"`;

				addNotification({ title, description });

				toast({
					title,
					description,
				});
			},
		);

		channel.bind(
			"team-member-added",
			(data: { teamId: string; teamName?: string; targetName?: string }) => {
				const title = "Team Member Added";
				const description = data.targetName
					? `${data.targetName} was added to the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A new member was added to your team.";

				addNotification({ title, description });

				toast({
					title,
					description,
				});
			},
		);

		channel.bind("you-were-added", (data: { teamName?: string }) => {
			const title = "Added to Team";
			const description = data.teamName
				? `You have been added to the team "${data.teamName}".`
				: "You have been added to a team.";

			addNotification({ title, description });

			toast({
				title,
				description,
			});
		});

		channel.bind(
			"team-member-updated",
			(data: { teamId: string; teamName?: string; targetName?: string }) => {
				const title = "Team Member Updated";
				const description = data.targetName
					? `${data.targetName}'s role or access was updated in the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A member's role or access was updated.";

				addNotification({ title, description });

				toast({
					title,
					description,
				});
			},
		);

		channel.bind(
			"team-member-removed",
			(data: { teamId: string; teamName?: string; targetName?: string }) => {
				const title = "Team Member Removed";
				const description = data.targetName
					? `${data.targetName} was removed from the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A member was removed from your team.";

				addNotification({ title, description });

				toast({
					title,
					description,
				});
			},
		);

		channel.bind("you-were-removed", (data: { teamName?: string }) => {
			const title = "Removed from Team";
			const description = data.teamName
				? `You are removed on this team "${data.teamName}".`
				: "You have been removed from a team.";

			addNotification({ title, description });

			toast({
				title,
				description,
			});
		});

		channel.bind(
			"team-member-invited",
			(data: { teamId: string; teamName?: string; email?: string }) => {
				const title = "Team Member Invited";
				const description = data.email
					? `${data.email} was invited to the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A new member was invited to your team.";

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
	}, [user, toast, addNotification]);

	return null;
}
