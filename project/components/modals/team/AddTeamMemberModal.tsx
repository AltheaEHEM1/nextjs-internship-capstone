"use client";

import { FolderPlus, Shield } from "lucide-react";
import { useState } from "react";
import BaseModal from "@/components/layout/BaseModal";

interface AddTeamMemberProps {
	opened: boolean;
	onClose: () => void;
}

export default function AddTeamMemberModal({
	opened,
	onClose,
}: AddTeamMemberProps) {
	const [selectedMember, setSelectedMember] = useState("");
	const [selectedRole, setSelectedRole] = useState("Member");
	const [accessibility, setAccessibility] = useState("member");

	const handleCreate = () => {
		console.log({
			selectedMember,
			selectedRole,
			accessibility,
		});
		onClose();
	};

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					<FolderPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Add Team Member</span>
				</div>
			}
			footer={
				<>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-platinum-300 dark:hover:bg-outer_space-400 transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleCreate}
						className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition"
					>
						Add Member
					</button>
				</>
			}
		>
			<div className="space-y-4">
				<div className="space-y-3">
					{/* Add Team Members */}
					<div>
						<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Add Team Members
						</label>
						<select
							value={selectedMember}
							onChange={(e) => setSelectedMember(e.target.value)}
							className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
						>
							<option value="">Select team members to include...</option>
							<option value="Alex Mercer">Alex Mercer</option>
							<option value="Sarah Jenkins">Sarah Jenkins</option>
						</select>
					</div>

					{/* Role Input */}
					<div>
						<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Member Role / Designation
						</label>
						<input
							type="text"
							placeholder="e.g. Frontend Engineer, Project Manager"
							value={selectedRole}
							onChange={(e) => setSelectedRole(e.target.value)}
							className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
						/>
					</div>

					{/* Accessibility Level */}
					<div>
						<label className="flex items-center gap-1.5 text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							<Shield size={14} className="text-blue_munsell-500" />
							Accessibility / Permission Level
						</label>
						<select
							value={accessibility}
							onChange={(e) => setAccessibility(e.target.value)}
							className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
						>
							<option value="administrator">
								Administrator (Full team control)
							</option>
							<option value="member">Member (Standard edit access)</option>
							<option value="viewer">Viewer (Read-only access)</option>
						</select>
					</div>
				</div>
			</div>
		</BaseModal>
	);
}
