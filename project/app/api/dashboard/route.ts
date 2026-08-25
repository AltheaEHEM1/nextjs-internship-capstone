import { NextResponse } from "next/server";
import { getDashboardDataQuery } from "@/lib/queries/dashboard";

export async function GET() {
	try {
		const result = await getDashboardDataQuery();
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/dashboard Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to fetch dashboard analytics.",
			},
			{ status: 500 },
		);
	}
}
