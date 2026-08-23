"use client";

import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useToast } from "@/hooks/toast/use-toast";
import { invitationSchema } from "@/lib/validation/Validations";

interface AddMemberProps {
	opened: boolean;
	onClose: () => void;
}

export default function AddMemberModal({ opened, onClose }: AddMemberProps) {
	const [addPeopleContact, setAddPeopleContact] = useState("");
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const handleBlur = (field: string) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	useEffect(() => {
		const newErrors: Record<string, string> = {};

		if (addPeopleContact.trim()) {
			const emails = addPeopleContact
				.split(/[, ]+/)
				.filter((e) => e.trim() !== "");
			const invalidEmails = emails.filter(
				(e) => !invitationSchema.shape.email.safeParse(e).success,
			);
			if (invalidEmails.length > 0) {
				newErrors.email = "One or more email addresses are invalid.";
			}
		}

		if (notes.trim()) {
			const notesRes = invitationSchema.shape.notes.safeParse(notes);
			if (!notesRes.success) newErrors.notes = notesRes.error.issues[0].message;
		}

		setErrors(newErrors);
	}, [addPeopleContact, notes]);

	useEffect(() => {
		if (!opened) {
			setAddPeopleContact("");
			setNotes("");
			setErrors({});
			setTouched({});
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
				emails.map(async (email: string) => {
					const req = await fetch("/api/invitation/send", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, notes: notes.trim() || undefined }),
					});
					return await req.json();
				}),
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
						disabled={
							loading ||
							!addPeopleContact.trim() ||
							Object.keys(errors).some((key) => errors[key])
						}
						className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 transition disabled:opacity-50"
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
						placeholder="colleague@example.com, another@example.com"
						value={addPeopleContact}
						onChange={(e) => {
							setAddPeopleContact(e.target.value);
							setTouched((prev) => ({ ...prev, email: true }));
						}}
						onBlur={() => handleBlur("email")}
						className={`w-full mt-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 ${touched.email && errors.email ? "border-red-500 focus:ring-red-500" : "border-french_gray-300 focus:ring-blue_munsell-500"}`}
					/>
					{touched.email && errors.email && (
						<p className="mt-1.5 text-xs text-red-500 font-medium">
							{errors.email}
						</p>
					)}
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
						onChange={(e) => {
							setNotes(e.target.value.replace(/\s{2,}/g, " "));
							setTouched((prev) => ({ ...prev, notes: true }));
						}}
						onBlur={() => handleBlur("notes")}
						className={`w-full mt-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 resize-none ${touched.notes && errors.notes ? "border-red-500 focus:ring-red-500" : "border-french_gray-300 focus:ring-blue_munsell-500"}`}
					/>
					{touched.notes && errors.notes && (
						<p className="mt-1.5 text-xs text-red-500 font-medium">
							{errors.notes}
						</p>
					)}
				</div>
			</div>
		</BaseModal>
	);
}
