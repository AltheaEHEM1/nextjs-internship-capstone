"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { respondToInvitation } from "@/actions/team-action";

export default function InvitationPage() {
	const params = useParams();
	const router = useRouter();
	const token = params.token as string;
	const [loading, setLoading] = useState(false);

	const handleResponse = async (action: "accept" | "reject") => {
		setLoading(true);
		try {
			const res = await respondToInvitation(token, action);
			if (res.status === "accept" || res.status === "accepted") {
				router.push(`/team`);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			alert((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="rounded-xl border p-6 bg-white shadow-md max-w-md text-center space-y-4">
				<h2 className="text-xl font-bold">Team Invitation</h2>
				<p className="text-sm text-gray-600">
					You have been invited to collaborate. Would you like to accept?
				</p>
				<div className="flex justify-center gap-4 pt-2">
					<button
						type="button"
						disabled={loading}
						onClick={() => handleResponse("reject")}
						className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
					>
						Reject
					</button>
					<button
						type="button"
						disabled={loading}
						onClick={() => handleResponse("accept")}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						{loading ? "Processing..." : "Accept Invitation"}
					</button>
				</div>
			</div>
		</div>
	);
}
