"use client";

import {
	CheckCircle2,
	FolderPlus,
	Loader2,
	Users,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/alert/alert";
import BaseModal from "@/components/layout/BaseModal";
import { useMinDate } from "@/hooks/project/useMinDate";
import { projectSchema } from "@/lib/validation/Validations";

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
	dueDate,
	setDueDate,
	onNext,
}: CreateProject1Props) {
	const minDate = useMinDate();
	const [teamsList, setTeamsList] = useState<{ id: string; name: string }[]>(
		[],
	);
	const [isCheckingName, setIsCheckingName] = useState(false);
	const [isNameUnique, setIsNameUnique] = useState<boolean | null>(null);

	const [isLoadingTeams, setIsLoadingTeams] = useState(true);

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [maxLengthErrors, setMaxLengthErrors] = useState<
		Record<string, string>
	>({});

	const handleBlur = (field: string) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	useEffect(() => {
		const newErrors: Record<string, string> = {};

		const nameRes = projectSchema.shape.name.safeParse(projectName.trim());
		if (!nameRes.success)
			newErrors.projectName = nameRes.error.issues[0].message;

		const descRes = projectSchema.shape.description.safeParse(
			description.trim(),
		);
		if (!descRes.success)
			newErrors.description = descRes.error.issues[0].message;

		setErrors(newErrors);
	}, [projectName, description]);

	useEffect(() => {
		async function fetchTeams() {
			if (opened) {
				setIsLoadingTeams(true);
				const res = await fetch(
					"/api/team/user-teams?permission=administrator",
				);
				const result = await res.json();
				if (result.success && result.data) {
					setTeamsList(result.data);
				}
				setIsLoadingTeams(false);
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
			const req = await fetch(
				`/api/project/check-name?name=${encodeURIComponent(projectName)}`,
			);
			const res = await req.json();
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
						disabled={
							!projectName.trim() ||
							!team ||
							!dueDate ||
							isNameUnique === false ||
							isCheckingName ||
							Object.keys(errors).some((key) => errors[key])
						}
						className="rounded-lg bg-[#1e9b65] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 disabled:opacity-50 transition"
					>
						Next
					</button>
				</>
			}
		>
			<div className="space-y-6">
				{!isLoadingTeams && teamsList.length === 0 && (
					<Alert variant="destructive">
						<AlertDescription>
							You need to invite and create a team first before you can create a
							project.
						</AlertDescription>
					</Alert>
				)}
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
							onChange={(e) => {
								let val = e.target.value.replace(/\s{2,}/g, " ");
								if (val.length > 50) {
									val = val.slice(0, 50);
									setMaxLengthErrors((prev) => ({
										...prev,
										projectName: "Project name is too long",
									}));
								} else {
									setMaxLengthErrors((prev) => ({ ...prev, projectName: "" }));
								}
								setProjectName(val);
								setTouched((prev) => ({ ...prev, projectName: true }));
							}}
							onBlur={() => handleBlur("projectName")}
							placeholder="e.g. Q3 Marketing Campaign"
							className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white pr-10 ${
								projectName.trim() !== ""
									? isCheckingName
										? "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
										: isNameUnique
											? "border-[#1e9b65] focus:border-[#1e9b65] focus:ring-[#1e9b65]"
											: "border-red-500 focus:border-red-500 focus:ring-red-500"
									: touched.projectName && errors.projectName
										? "border-red-500 focus:border-red-500 focus:ring-red-500"
										: "border-gray-300 focus:border-[#1e9b65] focus:ring-[#1e9b65] dark:border-gray-600"
							}`}
						/>
						<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							{isCheckingName && (
								<Loader2 size={16} className="animate-spin text-gray-400" />
							)}
							{!isCheckingName &&
								projectName.trim() !== "" &&
								isNameUnique === true && (
									<CheckCircle2 size={16} className="text-[#1e9b65]" />
								)}
							{!isCheckingName &&
								projectName.trim() !== "" &&
								isNameUnique === false && (
									<XCircle size={16} className="text-red-500" />
								)}
						</div>
					</div>
					{!isCheckingName &&
						isNameUnique === false &&
						projectName.trim() !== "" && (
							<p className="mt-1 text-xs text-red-500 font-medium">
								This project name is already taken.
							</p>
						)}
					{touched.projectName &&
						(errors.projectName || maxLengthErrors.projectName) && (
							<p className="mt-1 text-xs text-red-500 font-medium">
								{errors.projectName || maxLengthErrors.projectName}
							</p>
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
						onChange={(e) => {
							let val = e.target.value.replace(/\s{2,}/g, " ");
							if (val.length > 500) {
								val = val.slice(0, 500);
								setMaxLengthErrors((prev) => ({
									...prev,
									description: "Description is too long",
								}));
							} else {
								setMaxLengthErrors((prev) => ({ ...prev, description: "" }));
							}
							setDescription(val);
							setTouched((prev) => ({ ...prev, description: true }));
						}}
						onBlur={() => handleBlur("description")}
						placeholder="Briefly describe what this project is about..."
						rows={3}
						className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white ${
							touched.description && errors.description
								? "border-red-500 focus:border-red-500 focus:ring-red-500"
								: "border-gray-300 focus:border-[#1e9b65] focus:ring-[#1e9b65] dark:border-gray-600"
						}`}
					/>
					{touched.description &&
						(errors.description || maxLengthErrors.description) && (
							<p className="mt-1 text-xs text-red-500 font-medium">
								{errors.description || maxLengthErrors.description}
							</p>
						)}
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
