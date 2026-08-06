"use client";

import { FolderPlus, Plus, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { getAcceptedInvitesAction } from "@/actions/team-action";
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
	const membersList = useTeamStore((s) => s.membersList);

	useEffect(() => {
		if (opened) {
			getAcceptedInvitesAction().then(setAcceptedUsers).catch(console.error);
		}
	}, [opened]);

	const handleAddClick = () => {
		if (!currentMember) return;

		addMemberToList({
			userId: currentMember,
			role: currentRole,
			permission: currentAccessibility,
		} as any);

		// Reset form fields
		setCurrentMember("");
		setCurrentRole("Member");
	};

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
							<label className="text-xs font-medium text-outer_space-500">
								Select Member
							</label>
							<select
								value={currentMember}
								onChange={(e) => setCurrentMember(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm"
							>
								<option value="">Choose accepted user...</option>
								{acceptedUsers.map((u) => (
									<option key={u.id} value={u.id}>
										{u.name} ({u.email})
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="text-xs font-medium text-outer_space-500">
								Role / Designation
							</label>
							<input
								type="text"
								placeholder="e.g. Frontend Engineer"
								value={currentRole}
								onChange={(e) => setCurrentRole(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm"
							/>
						</div>
						<div>
							<label className="flex items-center gap-1.5 text-xs font-medium text-outer_space-500">
								<Shield size={14} className="text-blue_munsell-500" />
								Permission
							</label>
							<select
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
			</div>
		</BaseModal>
	);
}
