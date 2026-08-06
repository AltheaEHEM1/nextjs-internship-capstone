"use client";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { sendUserInvitationAction } from "@/actions/team-action";
import BaseModal from "@/components/layout/BaseModal";

interface AddMemberProps {
	opened: boolean;
	onClose: () => void;
}

export default function AddMemberModal({ opened, onClose }: AddMemberProps) {
	const [addPeopleContact, setAddPeopleContact] = useState("");
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleSendInvites = async () => {
		if (!addPeopleContact.trim()) {
			setFeedback({ type: "error", text: "Please enter a valid email." });
			return;
		}

		const emails = addPeopleContact
			.split(/[, ]+/)
			.map((e: string) => e.trim())
			.filter((e: string) => e.includes("@"));

		if (emails.length === 0) {
			setFeedback({
				type: "error",
				text: "No valid email addresses detected.",
			});
			return;
		}

		setLoading(true);
		setFeedback(null);
		try {
			await Promise.all(
				emails.map((email: string) => sendUserInvitationAction(email)),
			);

			setFeedback({
				type: "success",
				text: `Successfully sent ${emails.length} invitation(s).`,
			});
			setAddPeopleContact("");
			setTimeout(() => {
				setFeedback(null);
				onClose();
			}, 1500);
		} catch (error) {
			setFeedback({
				type: "error",
				text: (error as Error).message || "Failed to send invitations.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					<UserPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Invite People First</span>
				</div>
			}
			footer={
				<>
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSendInvites}
						disabled={loading}
						className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 transition"
					>
						{loading ? "Sending..." : "Send Invites"}
					</button>
				</>
			}
		>
			<div className="space-y-4">
				{feedback && (
					<div
						className={`p-3 rounded-xl text-xs font-medium ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
					>
						{feedback.text}
					</div>
				)}
				<div>
					<label className="text-xs font-medium text-outer_space-500">
						Email Address (comma-separated)
					</label>
					<input
						type="text"
						placeholder="colleague@example.com"
						value={addPeopleContact}
						onChange={(e) => setAddPeopleContact(e.target.value)}
						className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm"
					/>
				</div>
			</div>
		</BaseModal>
	);
}
