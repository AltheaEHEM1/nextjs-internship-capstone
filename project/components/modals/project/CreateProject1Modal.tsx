"use client";

import { FolderPlus, Users, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useMinDate } from "@/hooks/project/useMinDate";
import { getUserTeamsAction } from "@/actions/team/Team";
import { checkProjectNameUniqueAction } from "@/actions/project/Project";

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
	dueDate: string;
	setDueDate: (date: string) => void;
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
	dueDate,
	setDueDate,
	onNext,
}: CreateProject1Props) {
	const minDate = useMinDate();
	const [teamsList, setTeamsList] = useState<{ id: string; name: string }[]>([]);
	const [isCheckingName, setIsCheckingName] = useState(false);
	const [isNameUnique, setIsNameUnique] = useState<boolean | null>(null);

	useEffect(() => {
		async function fetchTeams() {
			if (opened) {
				const result = await getUserTeamsAction();
				if (result.success && result.data) {
					setTeamsList(result.data);
				}
			}
		}
		fetchTeams();
	}, [opened]);

	useEffect(() => {
		if (!projectName || projectName.trim() === "") {
			setIsNameUnique(null);
			setIsCheckingName(false);
			return;
		}

		setIsCheckingName(true);
		setIsNameUnique(null);

		const timeoutId = setTimeout(async () => {
			const res = await checkProjectNameUniqueAction(projectName);
			setIsCheckingName(false);
			if (res.success) {
				setIsNameUnique(res.isUnique as boolean);
			} else {
				setIsNameUnique(null);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [projectName]);

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
						disabled={!projectName.trim() || !team || !dueDate || isNameUnique === false || isCheckingName}
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
					<div className="relative">
						<input
							type="text"
							id="projectName"
							value={projectName}
							onChange={(e) => setProjectName(e.target.value)}
							placeholder="e.g. Q3 Marketing Campaign"
							className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white pr-10 ${
								projectName.trim() !== ""
									? isCheckingName
										? "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
										: isNameUnique
										? "border-[#1e9b65] focus:border-[#1e9b65] focus:ring-[#1e9b65]"
										: "border-red-500 focus:border-red-500 focus:ring-red-500"
									: "border-gray-300 focus:border-[#1e9b65] focus:ring-[#1e9b65] dark:border-gray-600"
							}`}
						/>
						<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							{isCheckingName && (
								<Loader2 size={16} className="animate-spin text-gray-400" />
							)}
							{!isCheckingName && projectName.trim() !== "" && isNameUnique === true && (
								<CheckCircle2 size={16} className="text-[#1e9b65]" />
							)}
							{!isCheckingName && projectName.trim() !== "" && isNameUnique === false && (
								<XCircle size={16} className="text-red-500" />
							)}
						</div>
					</div>
					{!isCheckingName && isNameUnique === false && projectName.trim() !== "" && (
						<p className="mt-1 text-xs text-red-500 font-medium">This project name is already taken.</p>
					)}
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
						className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						<Users size={16} className="text-[#1e9b65]" />
						Assign Team <span className="text-red-500">*</span>
					</label>
					<select
						id="team"
						value={team}
						required
						onChange={(e) => setTeam(e.target.value)}
						className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<option value="">Select a team...</option>
						{teamsList.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</select>
				</div>

				{/* Due Date Row */}
				<div>
					<label
						htmlFor="dueDate"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Due Date <span className="text-red-500">*</span>
					</label>
					<input
						type="date"
						id="dueDate"
						name="dueDate"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						min={minDate}
						required
						className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>
		</BaseModal>
	);
}
