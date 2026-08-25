import { NextResponse } from "next/server";
import { getInvitationByTokenQuery } from "@/lib/queries/invitation";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	try {
		const { token } = await params;
		const result = await getInvitationByTokenQuery(token);
		if (!result.success) {
			return NextResponse.json(result, { status: 400 });
		}
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/invitation/[token] Error:", err);
		return NextResponse.json(
			{ success: false, reason: "Failed to verify invitation." },
			{ status: 500 },
		);
	}
}
