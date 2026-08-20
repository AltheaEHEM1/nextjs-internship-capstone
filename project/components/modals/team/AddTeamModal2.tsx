"use client";

import { FolderPlus, Plus, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAcceptedInvitesAction } from "@/actions/team/TeamMember";
import BaseModal from "@/components/layout/BaseModal";
import { useTeamStore } from "@/stores/team/useTeamStore";

interface AcceptedUser {
	id: string;
	name: string;
	email: string;
}

interface AddTeam2Props {
	opened: boolean;
	onClose: () => void;
	onBack?: () => void;
	onSubmit?: () => void;
}

export default function AddTeamModal2({
	opened,
	onClose,
	onBack,
	onSubmit,
}: AddTeam2Props) {
	const [acceptedUsers, setAcceptedUsers] = useState<AcceptedUser[]>([]);

	// Local store states for form inputs
	const [currentMember, setCurrentMember] = useState("");
	const [currentRole, setCurrentRole] = useState("Member");
	const [currentAccessibility, setCurrentAccessibility] = useState<
		"administrator" | "member" | "viewer"
	>("member");

	const addMemberToList = useTeamStore((s) => s.addMemberToList);
	const removeMemberFromList = useTeamStore((s) => s.removeMemberFromList);
	const membersList = useTeamStore((s) => s.membersList);

	useEffect(() => {
		if (opened) {
			getAcceptedInvitesAction()
				.then((res: Record<string, unknown> | unknown[]) => {
					// Handles both raw array returns or standard { success, data } server action wrappers
					if (Array.isArray(res)) {
						setAcceptedUsers(res as AcceptedUser[]);
					} else if (res?.success && Array.isArray(res.data)) {
						setAcceptedUsers(res.data as AcceptedUser[]);
					} else if (Array.isArray(res?.users)) {
						setAcceptedUsers(res.users as AcceptedUser[]);
					}
				})
				.catch(console.error);
		}
	}, [opened]);

	const handleAddClick = () => {
		if (!currentMember) return;
		addMemberToList({
			userId: currentMember,
			role: currentRole,
			permission: currentAccessibility,
		} as Parameters<typeof addMemberToList>[0]);
		// Reset form fields
		setCurrentMember("");
		setCurrentRole("Member");
	};

	// Look up display info (name/email) for a queued member by userId,
	// since membersList only stores the raw userId/role/permission.
	const getUserInfo = (userId: string) =>
		acceptedUsers.find((u) => u.id === userId);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={550}
			title={
				<div className="flex items-center gap-2">
					<FolderPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Create Team - Add Accepted Members</span>
				</div>
			}
			footer={
				<div className="flex justify-end gap-2 w-full">
					<button
						type="button"
						onClick={onBack}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
					>
						Back
					</button>
					<button
						type="button"
						onClick={onSubmit}
						className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition"
					>
						Create Team
					</button>
				</div>
			}
		>
			<div className="space-y-5">
				<div className="rounded-xl border border-french_gray-200 bg-platinum-50/50 p-4 space-y-3">
					<h4 className="text-xs font-semibold text-outer_space-700 uppercase tracking-wider">
						Assign Accepted Invites
					</h4>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="sm:col-span-2">
							<label
								htmlFor="selectMember"
								className="text-xs font-medium text-outer_space-500"
							>
								Select Member
							</label>
							<select
								id="selectMember"
								value={currentMember}
								onChange={(e) => setCurrentMember(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm"
							>
								<option value="">Choose accepted user...</option>
								{acceptedUsers
									// hide users already queued so they can't be added twice
									.filter(
										(u, index, self) =>
											index === self.findIndex((t) => t.id === u.id) &&
											!membersList.some((m) => m.userId === u.id),
									)
									.map((u) => (
										<option key={u.id} value={u.id}>
											{u.name} ({u.email})
										</option>
									))}
							</select>
						</div>
						<div>
							<label
								htmlFor="role"
								className="text-xs font-medium text-outer_space-500"
							>
								Role / Designation
							</label>
							<input
								id="role"
								type="text"
								placeholder="e.g. Frontend Engineer"
								value={currentRole}
								onChange={(e) => setCurrentRole(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor="permission"
								className="flex items-center gap-1.5 text-xs font-medium text-outer_space-500"
							>
								<Shield size={14} className="text-blue_munsell-500" />
								Permission
							</label>
							<select
								id="permission"
								value={currentAccessibility}
								onChange={(e) =>
									setCurrentAccessibility(
										e.target.value as "administrator" | "member" | "viewer",
									)
								}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm"
							>
								<option value="administrator">Administrator</option>
								<option value="member">Member</option>
								<option value="viewer">Viewer</option>
							</select>
						</div>
					</div>
					<button
						type="button"
						onClick={handleAddClick}
						disabled={!currentMember}
						className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue_munsell-500 py-2 text-xs font-semibold text-blue_munsell-600 hover:bg-blue_munsell-500 hover:text-white disabled:opacity-50 transition"
					>
						<Plus size={16} />
						Add to Team List
					</button>
				</div>

				{/* Queued members */}
				<div className="rounded-xl border border-french_gray-200 p-4 space-y-3">
					<h4 className="text-xs font-semibold text-outer_space-700 uppercase tracking-wider">
						Members to Add ({membersList.length})
					</h4>

					{membersList.length === 0 ? (
						<p className="text-xs text-gray-400 py-2 text-center">
							No members added yet.
						</p>
					) : (
						<div className="divide-y divide-french_gray-100">
							{membersList.map((m) => {
								const info = getUserInfo(m.userId);
								return (
									<div
										key={m.userId}
										className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0"
									>
										<div>
											<p className="text-xs font-semibold text-outer_space-800">
												{info?.name ?? m.userId}
											</p>
											<p className="text-[11px] text-outer_space-400">
												{info?.email ? `${info.email} · ` : ""}
												{m.role} · {m.permission}
											</p>
										</div>
										<button
											type="button"
											onClick={() => removeMemberFromList(m.userId)}
											className="rounded-md p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
											aria-label={`Remove ${info?.name ?? "member"}`}
										>
											<X size={14} />
										</button>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</BaseModal>
	);
}
