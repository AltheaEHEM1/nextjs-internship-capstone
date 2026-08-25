import { NextResponse } from "next/server";
import { getProjectsQuery } from "@/lib/queries/project";

export async function GET() {
	try {
		const result = await getProjectsQuery();
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/project Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to fetch projects.",
			},
			{ status: 500 },
		);
	}
}
