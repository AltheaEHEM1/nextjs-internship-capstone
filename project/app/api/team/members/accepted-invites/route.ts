import { NextResponse } from "next/server";
import { getAcceptedInvitesQuery } from "@/lib/queries/team";

export async function GET() {
	try {
		const result = await getAcceptedInvitesQuery();
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/team/members/accepted-invites Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to fetch accepted invites.",
			},
			{ status: 500 },
		);
	}
}
