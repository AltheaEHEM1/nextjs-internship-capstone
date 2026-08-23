import { NextResponse } from "next/server";
import { getTaskHistoryQuery } from "@/lib/queries/task";

// GET /api/task/[id]/history
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const result = await getTaskHistoryQuery(id);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/task/[id]/history Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to fetch history",
			},
			{ status: 500 },
		);
	}
}
