import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function syncUser() {
	const clerkUser = await currentUser();

	if (!clerkUser) {
		return null;
	}

	const primaryEmail = clerkUser.emailAddresses.find(
		(e) => e.id === clerkUser.primaryEmailAddressId,
	)?.emailAddress;

	if (!primaryEmail) {
		throw new Error("User does not have a primary email address.");
	}

	const existingUser = await db.query.users.findFirst({
		where: eq(users.clerkId, clerkUser.id),
	});

	if (existingUser) {
		return existingUser;
	}

	// Insert user if not found in PostgreSQL
	const [newUser] = await db
		.insert(users)
		.values({
			clerkId: clerkUser.id,
			email: primaryEmail,
			name: clerkUser.firstName
				? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
				: primaryEmail.split("@")[0],
			avatar: clerkUser.imageUrl,
		})
		.returning();

	return newUser;
}
