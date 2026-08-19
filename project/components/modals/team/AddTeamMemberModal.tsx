"use client";

import { useEffect, useState } from "react";
import { getTeamDetailAction } from "@/actions/team/Team";
import {
	addMemberToTeamAction,
	getAcceptedInvitesAction,
} from "@/actions/team/TeamMember";
import { useToast } from "@/hooks/toast/use-toast";
import { useTeamStore } from "@/stores/team/useTeamStore";

interface AddTeamMemberModalProps {
	teamId?: string;
	isOpen: boolean;
	onClose: () => void;
}

export function AddTeamMemberModal({
	teamId,
	isOpen,
	onClose,
}: AddTeamMemberModalProps) {
	const storePeople = useTeamStore((s) => s.people);
	const teamDetail = useTeamStore((s) => s.teamDetail);
	const setTeamDetail = useTeamStore((s) => s.setTeamDetail);
	const { toast } = useToast();

	const [people, setPeople] = useState<
		Array<{ id: string; name: string; email: string }>
	>([]);
	const [existingEmails, setExistingEmails] = useState<Set<string>>(new Set());
	const [existingUserIds, setExistingUserIds] = useState<Set<string>>(
		new Set(),
	);

	const [email, setEmail] = useState("");
	const [role, setRole] = useState("Member");
	const [permission, setPermission] = useState<
		"administrator" | "member" | "viewer"
	>("member");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			if (storePeople && storePeople.length > 0) {
				setPeople(storePeople);
			}

			getAcceptedInvitesAction()
				.then((res: Record<string, unknown> | unknown[]) => {
					if (
						res &&
						!Array.isArray(res) &&
						res.success &&
						Array.isArray(res.data)
					) {
						setPeople(
							res.data as Array<{ id: string; name: string; email: string }>,
						);
					} else if (Array.isArray(res)) {
						setPeople(
							res as Array<{ id: string; name: string; email: string }>,
						);
					}
				})
				.catch(console.error);

			if (teamId) {
				if (teamDetail && teamDetail.id === teamId && teamDetail.members) {
					setExistingEmails(
						new Set(teamDetail.members.map((m) => m.email.toLowerCase())),
					);
					setExistingUserIds(new Set(teamDetail.members.map((m) => m.userId)));
				} else {
					getTeamDetailAction(teamId).then((res) => {
						if (res.success && res.data?.members) {
							setExistingEmails(
								new Set(res.data.members.map((m) => m.email.toLowerCase())),
							);
							setExistingUserIds(
								new Set(res.data.members.map((m) => m.userId)),
							);
						}
					});
				}
			}
		}
	}, [isOpen, teamId, storePeople, teamDetail]);

	useEffect(() => {
		if (!isOpen) {
			setEmail("");
			setRole("Member");
			setPermission("member");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const selectedPerson = people.find((p) => p.email === email);
	const isAlreadyInTeam = Boolean(
		teamId &&
			email &&
			(existingEmails.has(email.toLowerCase()) ||
				(selectedPerson && existingUserIds.has(selectedPerson.id))),
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		if (isAlreadyInTeam) {
			toast({
				title: "Already a member",
				description: "This person is already a member of this team.",
				variant: "warning",
			});
			return;
		}

		setLoading(true);
		try {
			if (teamId) {
				const res = await addMemberToTeamAction({
					teamId,
					userId: selectedPerson?.id,
					email,
					role,
					permission,
				});

				if (!res.success) {
					toast({
						title: "Error",
						description: res.error || "Failed to add member to team.",
						variant: "destructive",
					});
					return;
				}

				toast({
					title: "Member added",
					description: `${selectedPerson?.name || email} has been successfully added to the team.`,
					variant: "success",
				});

				// Refresh team detail in store
				const refreshed = await getTeamDetailAction(teamId);
				if (refreshed.success && refreshed.data) {
					setTeamDetail(refreshed.data as Parameters<typeof setTeamDetail>[0]);
				}
			}

			setEmail("");
			onClose();
		} catch (error) {
			toast({
				title: "Error",
				description: (error as Error).message || "Failed to add team member.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-outer_space-500">
				<h3 className="text-lg font-bold text-outer_space-800 dark:text-platinum-100">
					Add Team Member
				</h3>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
						>
							Email Address
						</label>
						<select
							id="email"
							required
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
						>
							<option value="">Select a person...</option>
							{people
								.filter(
									(person, index, self) =>
										index === self.findIndex((t) => t.id === person.id) &&
										!(
											teamId &&
											(existingEmails.has(person.email.toLowerCase()) ||
												existingUserIds.has(person.id))
										),
								)
								.map((person) => (
									<option key={person.id || person.email} value={person.email}>
										{person.name
											? `${person.name} (${person.email})`
											: person.email}
									</option>
								))}
						</select>
					</div>

					<div>
						<label
							htmlFor="role"
							className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
						>
							Role Title
						</label>
						<input
							id="role"
							type="text"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							placeholder="e.g. Frontend Engineer"
							className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
						/>
					</div>

					<div>
						<label
							htmlFor="permission"
							className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
						>
							Permission Level
						</label>
						<select
							id="permission"
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
							disabled={loading || !email || isAlreadyInTeam}
							className="rounded-xl bg-blue_munsell-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue_munsell-600 transition-colors disabled:opacity-50"
						>
							{loading ? "Adding..." : "Add to Team"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
