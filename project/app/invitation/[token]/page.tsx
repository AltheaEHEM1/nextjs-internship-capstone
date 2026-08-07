"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	getInvitationByTokenAction,
	respondToInvitation,
} from "@/actions/team/Invitation";
import { useToast } from "@/hooks/toast/use-toast";

export default function InvitationPage() {
	const params = useParams();
	const router = useRouter();
	const token = params.token as string;
	const { toast } = useToast();

	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState(false);
	const [invitationData, setInvitationData] = useState<any>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		async function verify() {
			const res = await getInvitationByTokenAction(token);
			if (!res.success) {
				setErrorMessage(res.reason || "Invalid invitation.");
			} else {
				setInvitationData(res.invitation);
			}
			setLoading(false);
		}
		verify();
	}, [token]);

	const handleResponse = async (action: "accept" | "decline") => {
		setActionLoading(true);
		const res = await respondToInvitation(token, action);
		setActionLoading(false);

		if (res.success) {
			router.push("/team");
		} else {
			if (res.error === "Unauthorized") {
				// Redirect to Clerk sign-in (or your login route) and return back to this token page
				router.push(
					`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`,
				);
			} else {
				toast({
					title: "Error",
					description: res.error || "Failed to process invitation.",
					variant: "destructive",
				});
			}
		}
	};

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-outer_space-600">
				<Loader2 className="animate-spin text-blue_munsell-500" size={36} />
			</div>
		);
	}

	if (errorMessage) {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-outer_space-600 p-4">
				<div className="max-w-md w-full rounded-2xl bg-white dark:bg-outer_space-500 p-8 shadow-xl text-center space-y-4">
					<XCircle className="mx-auto text-rose-500" size={48} />
					<h2 className="text-lg font-bold text-gray-800 dark:text-platinum-100">
						Unable to Join
					</h2>
					<p className="text-sm text-gray-500 dark:text-platinum-300">
						{errorMessage}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-outer_space-600 p-4">
			<div className="max-w-md w-full rounded-2xl bg-white dark:bg-outer_space-500 p-8 shadow-xl text-center space-y-6">
				<CheckCircle2 className="mx-auto text-emerald-500" size={48} />
				<div>
					<h2 className="text-xl font-bold text-gray-900 dark:text-platinum-100">
						Team Invitation
					</h2>
					<p className="text-sm text-gray-500 dark:text-platinum-300 mt-1">
						You have been invited to collaborate on Projectnify.
					</p>
				</div>

				{invitationData?.notes && (
					<div className="p-3 bg-gray-50 dark:bg-outer_space-400 rounded-xl text-xs italic text-gray-600 dark:text-platinum-200">
						&ldquo;{invitationData.notes}&rdquo;
					</div>
				)}

				<div className="flex gap-3 pt-2">
					<button
						type="button"
						disabled={actionLoading}
						onClick={() => handleResponse("decline")}
						className="flex-1 rounded-xl border border-gray-300 dark:border-paynes_gray-600 py-2.5 text-sm font-semibold text-gray-700 dark:text-platinum-200 hover:bg-gray-100 dark:hover:bg-outer_space-400 transition"
					>
						Decline
					</button>
					<button
						type="button"
						disabled={actionLoading}
						onClick={() => handleResponse("accept")}
						className="flex-1 rounded-xl bg-blue_munsell-500 py-2.5 text-sm font-semibold text-white hover:bg-blue_munsell-600 transition shadow-sm"
					>
						{actionLoading ? "Processing..." : "Accept Invite"}
					</button>
				</div>
			</div>
		</div>
	);
}
