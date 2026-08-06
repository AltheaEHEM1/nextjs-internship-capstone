"use client";

import { useState } from "react";
import { sendUserInvitationAction } from "@/actions/team-action";

interface AddTeamMemberModalProps {
	teamId?: string; // Optional now since team might not be the direct parent context yet
	isOpen: boolean;
	onClose: () => void;
}

export function AddTeamMemberModal({
	isOpen,
	onClose,
}: AddTeamMemberModalProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("Member");
	const [permission, setPermission] = useState<
		"administrator" | "member" | "viewer"
	>("member");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setLoading(true);
		try {
			await sendUserInvitationAction(email);
			setEmail("");
			onClose();
		} catch (error) {
			alert((error as Error).message || "Failed to send invitation");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-outer_space-500">
				<h3 className="text-lg font-bold text-outer_space-800 dark:text-platinum-100">
					Invite Team Member
				</h3>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<label className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Email Address
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="colleague@example.com"
							className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Role Title
						</label>
						<input
							type="text"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							placeholder="e.g. Frontend Engineer"
							className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Permission Level
						</label>
						<select
							value={permission}
							onChange={(e) =>
								setPermission(
									e.target.value as "administrator" | "member" | "viewer",
								)
							}
							className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
						>
							<option value="member">Member</option>
							<option value="administrator">Administrator</option>
							<option value="viewer">Viewer</option>
						</select>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							disabled={loading}
							className="rounded-xl px-4 py-2 text-xs font-semibold text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 dark:hover:bg-outer_space-400"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="rounded-xl bg-blue_munsell-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue_munsell-600 transition-colors disabled:opacity-50"
						>
							{loading ? "Sending..." : "Send Invite"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
