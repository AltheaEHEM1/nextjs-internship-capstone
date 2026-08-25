import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { projectStatuses } from "@/lib/db/schema/index";

// PATCH /api/project/[id]/statuses/reorder
export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const { statuses } = await req.json();
		await getAuthenticatedDbUser();

		for (const s of statuses) {
			await db
				.update(projectStatuses)
				.set({ position: s.position })
				.where(eq(projectStatuses.id, s.id));
		}

		if (id) {
			revalidatePath(`/projects/${id}`);
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("PATCH /api/project/[id]/statuses/reorder Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error ? err.message : "Failed to reorder statuses",
			},
			{ status: 500 },
		);
	}
}
