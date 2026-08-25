import PusherServer from "pusher";

export const pusherServer = process.env.PUSHER_APP_ID
	? new PusherServer({
			appId: process.env.PUSHER_APP_ID,
			key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
			secret: process.env.PUSHER_SECRET as string,
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
			useTLS: true,
		})
	: null;
