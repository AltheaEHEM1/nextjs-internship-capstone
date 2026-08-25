import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { users } from "@/lib/db/schema/index";

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

	const freshName = clerkUser.firstName
		? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
		: primaryEmail.split("@")[0];

	const freshAvatar = clerkUser.imageUrl;

	const existingUser = await db.query.users.findFirst({
		where: eq(users.clerkId, clerkUser.id),
	});

	if (existingUser) {
		const hasChanged =
			existingUser.email !== primaryEmail ||
			existingUser.name !== freshName ||
			existingUser.avatar !== freshAvatar;

		if (!hasChanged) {
			return existingUser;
		}

		const [updatedUser] = await db
			.update(users)
			.set({
				email: primaryEmail,
				name: freshName,
				avatar: freshAvatar,
			})
			.where(eq(users.id, existingUser.id))
			.returning();

		return updatedUser;
	}

	const [newUser] = await db
		.insert(users)
		.values({
			clerkId: clerkUser.id,
			email: primaryEmail,
			name: freshName,
			avatar: freshAvatar,
		})
		.returning();

	return newUser;
}
