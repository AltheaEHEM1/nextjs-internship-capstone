"use client";

import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { sendUserInvitationAction } from "@/actions/team/Invitation";
import BaseModal from "@/components/layout/BaseModal";
import { useToast } from "@/hooks/toast/use-toast";

interface AddMemberProps {
	opened: boolean;
	onClose: () => void;
}

export default function AddMemberModal({ opened, onClose }: AddMemberProps) {
	const [addPeopleContact, setAddPeopleContact] = useState("");
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (!opened) {
			setAddPeopleContact("");
			setNotes("");
		}
	}, [opened]);

	const handleSendInvites = async () => {
		if (!addPeopleContact.trim()) {
			toast({
				title: "Validation Error",
				description: "Please enter a valid email address.",
				variant: "warning",
			});
			return;
		}

		const emails = addPeopleContact
			.split(/[, ]+/)
			.map((e: string) => e.trim())
			.filter((e: string) => e.includes("@"));

		if (emails.length === 0) {
			toast({
				title: "Invalid Email",
				description: "No valid email addresses detected.",
				variant: "warning",
			});
			return;
		}

		setLoading(true);
		try {
			// Pass both email and the optional notes string to the action
			const results = await Promise.all(
				emails.map((email: string) =>
					sendUserInvitationAction(email, notes.trim() || undefined),
				),
			);

			const failed = results.filter((r) => !r.success);
			const succeeded = results.filter((r) => r.success);

			if (failed.length > 0) {
				const errorMsg =
					failed
						.map((f) => f.error)
						.filter(Boolean)
						.join("; ") || "Failed to send email.";

				toast({
					title:
						failed.length === emails.length
							? "Failed to send invitation"
							: "Partial Invitation Failure",
					description: errorMsg,
					variant: "destructive",
				});

				if (failed.length === emails.length) {
					return;
				}
			}

			if (succeeded.length > 0) {
				toast({
					title: "Invitations Sent",
					description: `Successfully sent ${succeeded.length} invitation(s).`,
					variant: "success",
				});
				setAddPeopleContact("");
				setNotes("");
				setTimeout(() => {
					onClose();
				}, 800);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: (error as Error).message || "Failed to send invitations.",
				variant: "destructive",
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
				<div>
					<label
						htmlFor="invite-email-input"
						className="text-xs font-medium text-outer_space-500"
					>
						Email Address (comma-separated)
					</label>
					<input
						id="invite-email-input"
						type="text"
						placeholder="colleague@example.com"
						value={addPeopleContact}
						onChange={(e) => setAddPeopleContact(e.target.value)}
						className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue_munsell-500"
					/>
				</div>

				<div>
					<div className="flex justify-between items-center">
						<label
							htmlFor="invite-notes-input"
							className="text-xs font-medium text-outer_space-500"
						>
							Personal Note <span className="text-gray-400">(Optional)</span>
						</label>
						<span className="text-[10px] text-gray-400">
							{notes.length}/100
						</span>
					</div>
					<textarea
						id="invite-notes-input"
						maxLength={100}
						rows={3}
						placeholder="Add a personal message to your invitation..."
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue_munsell-500 resize-none"
					/>
				</div>
			</div>
		</BaseModal>
	);
}
