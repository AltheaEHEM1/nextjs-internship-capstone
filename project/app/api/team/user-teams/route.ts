import { NextResponse } from "next/server";
import { getUserTeamsQuery } from "@/lib/queries/team";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const permission = searchParams.get("permission") as
			| "administrator"
			| "member"
			| "viewer"
			| null;

		const result = await getUserTeamsQuery(permission || undefined);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/team/user-teams Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error ? err.message : "Failed to fetch user teams.",
			},
			{ status: 500 },
		);
	}
}
