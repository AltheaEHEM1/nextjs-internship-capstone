import { NextResponse } from "next/server";
import { checkTaskTitleUniqueQuery } from "@/lib/queries/task";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const name = searchParams.get("name") ?? "";
		const result = await checkTaskTitleUniqueQuery(name);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/task/check-name Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to check task name uniqueness.",
			},
			{ status: 500 },
		);
	}
}
