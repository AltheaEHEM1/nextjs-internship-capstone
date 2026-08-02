"use client";

import { FolderPlus, Users } from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";

export type AccessRole = "administrator" | "member" | "viewer";

interface CreateProject1Props {
	opened: boolean;
	onClose: () => void;
	projectName: string;
	setProjectName: (name: string) => void;
	description: string;
	setDescription: (desc: string) => void;
	team: string;
	setTeam: (team: string) => void;
	access: AccessRole;
	setAccess: (role: AccessRole) => void;
	onNext: () => void;
}

export default function CreateProject1({
	opened,
	onClose,
	projectName,
	setProjectName,
	description,
	setDescription,
	team,
	setTeam,
	access,
	setAccess,
	onNext,
}: CreateProject1Props) {
	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					<FolderPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Add Project</span>
				</div>
			}
			footer={
				<>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onNext}
						disabled={!projectName.trim()}
						className="rounded-lg bg-[#1e9b65] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 disabled:opacity-50 transition"
					>
						Next
					</button>
				</>
			}
		>
			<div className="space-y-6">
				{/* Project Name */}
				<div>
					<label
						htmlFor="projectName"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Project Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="projectName"
						value={projectName}
						onChange={(e) => setProjectName(e.target.value)}
						placeholder="e.g. Q3 Marketing Campaign"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Description{" "}
						<span className="text-gray-400 text-xs">(optional)</span>
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Briefly describe what this project is about..."
						rows={3}
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				{/* Team Field */}
				<div>
					<label
						htmlFor="team"
						className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						<Users size={16} className="text-[#1e9b65]" />
						Assign Team
					</label>
					<select
						id="team"
						value={team}
						onChange={(e) => setTeam(e.target.value)}
						className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<option value="">Select a team...</option>
						<option value="Core Architecture Unit">
							Core Architecture Unit
						</option>
						<option value="Frontend Team">Frontend Team</option>
						<option value="Backend Team">Backend Team</option>
						<option value="UI/UX Design">UI/UX Design</option>
					</select>
				</div>

				{/* Accessibility & Due Date Row */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label
							htmlFor="access"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Accessibility
						</label>
						<select
							id="access"
							value={access}
							onChange={(e) => setAccess(e.target.value as AccessRole)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="administrator">Administrator</option>
							<option value="member">Member</option>
							<option value="viewer">Viewer</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="dueDate"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Due Date
						</label>
						<input
							type="date"
							id="dueDate"
							min={new Date().toISOString().split("T")[0]}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
					</div>
				</div>
			</div>
		</BaseModal>
	);
}
