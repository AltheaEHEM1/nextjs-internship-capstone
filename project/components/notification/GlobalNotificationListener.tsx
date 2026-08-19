"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastAction } from "@/components/toast/toast";
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
					action: (
						<ToastAction
							altText="View Notifications"
							onClick={() => router.push("/notification")}
						>
							View
						</ToastAction>
					),
				});
			},
		);

		return () => {
			pusherClient?.unsubscribe(channelName);
		};
	}, [user, toast, router, addNotification]);

	return null;
}
