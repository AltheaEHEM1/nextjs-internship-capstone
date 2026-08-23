import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { invitations, teamMembers, users } from "@/lib/db/schema/index";
import { getPersonDetailQuery } from "@/lib/queries/team";

// GET /api/team/members/[personId] — get person detail
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ personId: string }> },
) {
	try {
		const { personId } = await params;
		const result = await getPersonDetailQuery(personId);
		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/team/members/[personId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error ? err.message : "Failed to fetch person detail.",
			},
			{ status: 500 },
		);
	}
}

// DELETE /api/team/members/[personId] — remove a person from all teams & invitations
export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ personId: string }> },
) {
	try {
		const { personId } = await params;
		const dbUser = await getAuthenticatedDbUser();

		const personUser = await db.query.users.findFirst({
			where: eq(users.id, personId),
		});

		if (personUser) {
			await db
				.delete(invitations)
				.where(
					and(
						eq(invitations.invitedById, dbUser.id),
						sql`LOWER(${invitations.email}) = LOWER(${personUser.email})`,
					),
				);
		}

		await db.delete(teamMembers).where(eq(teamMembers.userId, personId));

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("DELETE /api/team/members/[personId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to remove person.",
			},
			{ status: 500 },
		);
	}
}
