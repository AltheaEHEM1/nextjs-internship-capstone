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

		// ─── Task Events ──────────────────────────────────────────────────────────

		channel.bind(
			"task-assigned",
			(data: {
				taskTitle: string;
				assignerName: string;
				projectId?: string;
				taskId?: string;
			}) => {
				const title = "New Task Assigned";
				const description = `${data.assignerName} assigned you to "${data.taskTitle}"`;
				const href = data.projectId ? `/projects/${data.projectId}` : "/projects";

				addNotification({ title, description, type: "task", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"task-added",
			(data: {
				taskTitle: string;
				creatorName: string;
				projectId?: string;
				taskId?: string;
			}) => {
				const title = "New Task Created";
				const description = `${data.creatorName} added a new task "${data.taskTitle}"`;
				const href = data.projectId ? `/projects/${data.projectId}` : "/projects";

				addNotification({ title, description, type: "task", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"task-commented",
			(data: {
				taskTitle: string;
				commenterName: string;
				projectId?: string;
				taskId?: string;
			}) => {
				const title = "New Comment on Task";
				const description = `${data.commenterName} commented on "${data.taskTitle}"`;
				const href = data.projectId ? `/projects/${data.projectId}` : "/projects";

				addNotification({ title, description, type: "comment", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"task-edited",
			(data: {
				taskTitle: string;
				editorName: string;
				projectId?: string;
				taskId?: string;
			}) => {
				const title = "Task Edited";
				const description = `${data.editorName} edited "${data.taskTitle}"`;
				const href = data.projectId ? `/projects/${data.projectId}` : "/projects";

				addNotification({ title, description, type: "task", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"task-deleted",
			(data: {
				taskTitle: string;
				deleterName: string;
				projectId?: string;
			}) => {
				const title = "Task Deleted";
				const description = `${data.deleterName} deleted the task "${data.taskTitle}"`;
				const href = data.projectId ? `/projects/${data.projectId}` : "/projects";

				addNotification({ title, description, type: "task", href });
				toast({ title, description });
			},
		);

		// ─── Project Events ───────────────────────────────────────────────────────

		channel.bind(
			"project-deleted",
			(data: { projectName: string; deleterName: string }) => {
				const title = "Project Deleted";
				const description = `${data.deleterName} deleted the project "${data.projectName}"`;

				addNotification({ title, description, type: "project", href: "/projects" });
				toast({ title, description });
			},
		);

		channel.bind(
			"project-added",
			(data: { projectName: string; creatorName: string; projectId?: string }) => {
				const title = "Added to Project";
				const description = `${data.creatorName} added your team to the project "${data.projectName}"`;
				const href = data.projectId
					? `/projects/${data.projectId}`
					: "/projects";

				addNotification({ title, description, type: "project", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"project-edited",
			(data: { projectName: string; editorName: string; projectId?: string }) => {
				const title = "Project Updated";
				const description = `${data.editorName} updated the project "${data.projectName}"`;
				const href = data.projectId
					? `/projects/${data.projectId}`
					: "/projects";

				addNotification({ title, description, type: "project", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"project-archived",
			(data: { projectName: string; editorName: string; projectId?: string }) => {
				const title = "Project Archived";
				const description = `${data.editorName} archived the project "${data.projectName}"`;
				const href = data.projectId
					? `/projects/${data.projectId}`
					: "/projects";

				addNotification({ title, description, type: "project", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"project-restored",
			(data: { projectName: string; editorName: string; projectId?: string }) => {
				const title = "Project Restored";
				const description = `${data.editorName} restored the project "${data.projectName}"`;
				const href = data.projectId
					? `/projects/${data.projectId}`
					: "/projects";

				addNotification({ title, description, type: "project", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"project-finished",
			(data: { projectName: string }) => {
				const title = "Project Finished";
				const description = `The project "${data.projectName}" has reached its due date and is now marked as finished.`;

				addNotification({ title, description, type: "system", href: "/projects" });
				toast({ title, description });
			},
		);

		channel.bind(
			"project-ending-soon",
			(data: { projectName: string }) => {
				const title = "Project Due Soon";
				const description = `The project "${data.projectName}" is due in 3 days or less!`;

				addNotification({ title, description, type: "system", href: "/projects" });
				toast({ title, description });
			},
		);

		// ─── Team Events ──────────────────────────────────────────────────────────

		channel.bind(
			"team-created",
			(data: { teamId?: string; teamName?: string }) => {
				const title = "Team Created";
				const description = data.teamName
					? `Your team "${data.teamName}" was created successfully.`
					: "Your new team was created successfully.";
				const href = data.teamId ? `/team/team/${data.teamId}` : "/team";

				addNotification({ title, description, type: "team", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"team-updated",
			(data: { teamId?: string; teamName?: string; editorName?: string }) => {
				const title = "Team Updated";
				const description = data.teamName
					? `${data.editorName || "Someone"} updated the team "${data.teamName}".`
					: "Your team information was updated.";
				const href = data.teamId ? `/team/team/${data.teamId}` : "/team";

				addNotification({ title, description, type: "team", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"team-member-added",
			(data: { teamId?: string; teamName?: string; targetName?: string }) => {
				const title = "Team Member Added";
				const description = data.targetName
					? `${data.targetName} was added to the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A new member was added to your team.";
				const href = data.teamId ? `/team/team/${data.teamId}` : "/team";

				addNotification({ title, description, type: "team", href });
				toast({ title, description });
			},
		);

		channel.bind("you-were-added", (data: { teamName?: string }) => {
			const title = "Added to Team";
			const description = data.teamName
				? `You have been added to the team "${data.teamName}".`
				: "You have been added to a team.";

			addNotification({ title, description, type: "team", href: "/team" });
			toast({ title, description });
		});

		channel.bind(
			"team-member-updated",
			(data: { teamId?: string; teamName?: string; targetName?: string }) => {
				const title = "Team Member Updated";
				const description = data.targetName
					? `${data.targetName}'s role or access was updated in the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A member's role or access was updated.";
				const href = data.teamId ? `/team/team/${data.teamId}` : "/team";

				addNotification({ title, description, type: "team", href });
				toast({ title, description });
			},
		);

		channel.bind(
			"team-member-removed",
			(data: { teamId?: string; teamName?: string; targetName?: string }) => {
				const title = "Team Member Removed";
				const description = data.targetName
					? `${data.targetName} was removed from the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A member was removed from your team.";
				const href = data.teamId ? `/team/team/${data.teamId}` : "/team";

				addNotification({ title, description, type: "team", href });
				toast({ title, description });
			},
		);

		channel.bind("you-were-removed", (data: { teamName?: string }) => {
			const title = "Removed from Team";
			const description = data.teamName
				? `You have been removed from the team "${data.teamName}".`
				: "You have been removed from a team.";

			addNotification({ title, description, type: "team", href: "/team" });
			toast({ title, description });
		});

		channel.bind(
			"team-member-invited",
			(data: { teamId?: string; teamName?: string; email?: string }) => {
				const title = "Team Member Invited";
				const description = data.email
					? `${data.email} was invited to the team${data.teamName ? ` "${data.teamName}"` : ""}.`
					: "A new member was invited to your team.";
				const href = data.teamId ? `/team/team/${data.teamId}` : "/team";

				addNotification({ title, description, type: "team", href });
				toast({ title, description });
			},
		);

		return () => {
			pusherClient?.unsubscribe(channelName);
		};
	}, [user, toast, addNotification]);

	return null;
}
