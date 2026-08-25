import { NextResponse } from "next/server";
import { checkTeamNameUniqueQuery } from "@/lib/queries/team";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const name = searchParams.get("name") ?? "";
		const result = await checkTeamNameUniqueQuery(name);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/team/check-name Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to check team name uniqueness.",
			},
			{ status: 500 },
		);
	}
}
