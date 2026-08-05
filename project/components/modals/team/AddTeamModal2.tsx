"use client";

import { FolderPlus, Plus, Shield, Trash2 } from "lucide-react";
import { useEffect } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useCustomAddTeamModal2Store } from "@/stores/team/custom-add-team-modal2-store";
import type { TeamMemberAssignment } from "@/stores/team/custom-add-team-member-store";

interface AddTeam2Props {
	opened: boolean;
	onClose: () => void;
	onBack: () => void;
	onSubmit: (members: TeamMemberAssignment[]) => void;
	initialData: { members?: TeamMemberAssignment[] };
}

export default function AddTeamModal2({
	opened,
	onClose,
	onBack,
	onSubmit,
	initialData,
}: AddTeam2Props) {
	const {
		membersList,
		setMembersList,
		currentMember,
		setCurrentMember,
		currentRole,
		setCurrentRole,
		currentAccessibility,
		setCurrentAccessibility,
		handleAddToList,
		handleRemoveMember,
		handleCreate,
		initialize,
		reset,
	} = useCustomAddTeamModal2Store();

	useEffect(() => {
		if (opened) {
			reset();
			initialize({ onSubmit });
			if (initialData.members) {
				setMembersList(initialData.members);
			}
		}
	}, [opened]);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={550}
			title={
				<div className="flex items-center gap-2">
					<FolderPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Create Team</span>
				</div>
			}
			footer={
				<div className="flex justify-end gap-2 w-full">
					<button
						type="button"
						onClick={onBack}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-platinum-300 dark:hover:bg-outer_space-400 transition"
					>
						Back
					</button>
					<button
						type="button"
						onClick={handleCreate}
						className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition"
					>
						Create Team
					</button>
				</div>
			}
		>
			<div className="space-y-5">
				{/* Input Section for Adding a Member */}
				<div className="rounded-xl border border-french_gray-200 bg-platinum-50/50 p-4 space-y-3 dark:border-payne's_gray-600 dark:bg-outer_space-400/50">
					<h4 className="text-xs font-semibold text-outer_space-700 dark:text-platinum-200 uppercase tracking-wider">
						Assign Member Details
					</h4>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* Member Selection */}
						<div className="sm:col-span-2">
							<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
								Select Member
							</label>
							<select
								value={currentMember}
								onChange={(e) => setCurrentMember(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
							>
								<option value="">Choose team member...</option>
								<option value="Alex Mercer">Alex Mercer</option>
								<option value="Sarah Jenkins">Sarah Jenkins</option>
							</select>
						</div>

						{/* Role Input */}
						<div>
							<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
								Role / Designation
							</label>
							<input
								type="text"
								placeholder="e.g. Frontend Engineer"
								value={currentRole}
								onChange={(e) => setCurrentRole(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
							/>
						</div>

						{/* Accessibility Level */}
						<div>
							<label className="flex items-center gap-1.5 text-xs font-medium text-outer_space-500 dark:text-platinum-300">
								<Shield size={14} className="text-blue_munsell-500" />
								Permission
							</label>
							<select
								value={currentAccessibility}
								onChange={(e) => setCurrentAccessibility(e.target.value)}
								className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
							>
								<option value="administrator">Administrator</option>
								<option value="member">Member</option>
								<option value="viewer">Viewer</option>
							</select>
						</div>
					</div>

					{/* Add to List Button */}
					<button
						type="button"
						onClick={handleAddToList}
						disabled={!currentMember}
						className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue_munsell-500 py-2 text-xs font-semibold text-blue_munsell-600 hover:bg-blue_munsell-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
					>
						<Plus size={16} />
						Add to Team List
					</button>
				</div>

				{/* Display List of Added Members */}
				<div className="space-y-2">
					<label className="text-xs font-semibold text-outer_space-700 dark:text-platinum-200">
						Added Members ({membersList.length})
					</label>

					{membersList.length === 0 ? (
						<p className="text-xs text-outer_space-400 dark:text-platinum-400 italic py-2 text-center border border-dashed border-french_gray-200 rounded-lg dark:border-payne's_gray-600">
							No members added yet. Use the form above to add team members.
						</p>
					) : (
						<div className="max-h-48 overflow-y-auto space-y-2 pr-1">
							{membersList.map((item, index) => (
								<div
									key={index}
									className="flex items-center justify-between rounded-lg border border-french_gray-200 bg-white p-3 shadow-2xs dark:border-payne's_gray-600 dark:bg-outer_space-500"
								>
									<div>
										<h5 className="text-xs font-bold text-outer_space-800 dark:text-platinum-100">
											{item.member}
										</h5>
										<p className="text-[11px] text-outer_space-400 dark:text-platinum-400">
											{item.role} •{" "}
											<span className="capitalize">{item.accessibility}</span>
										</p>
									</div>
									<button
										type="button"
										onClick={() => handleRemoveMember(index)}
										className="text-red-500 hover:text-red-700 p-1 transition"
										title="Remove member"
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</BaseModal>
	);
}
