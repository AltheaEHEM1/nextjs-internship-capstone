import { NextResponse } from "next/server";
import { checkProjectNameUniqueQuery } from "@/lib/queries/project";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const name = searchParams.get("name") ?? "";
		const result = await checkProjectNameUniqueQuery(name);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/project/check-name Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to check project name uniqueness.",
			},
			{ status: 500 },
		);
	}
}
