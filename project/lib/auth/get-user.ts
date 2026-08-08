import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { syncUser } from "@/lib/auth/sync-user";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function getAuthenticatedDbUser() {
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
