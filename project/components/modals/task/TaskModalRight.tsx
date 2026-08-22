import { useUser } from "@clerk/nextjs";
import { Flag, Tag } from "lucide-react";
import Image from "next/image";
import { useTaskModalStore } from "@/stores/task/TaskModalStore";

interface TaskModalRightProps {
	projectData: {
		members: { id: string; userId: string; name: string }[];
		statuses: { id: string; name: string; color: string }[];
		labels: { name: string; color: string }[];
		priorities: [string, ...string[]];
	} | null;
	isLoading: boolean;
	onOpenAddPriority?: () => void;
	onOpenAddLabel?: () => void;
}

export default function TaskModalRight({
	projectData,
	isLoading,
	onOpenAddPriority,
	onOpenAddLabel,
}: TaskModalRightProps) {
	const {
		mode,
		status,
		setStatus,
		priority,
		setPriority,
		assignee, // using assignee for team
		setAssignee,
		startDate,
		setStartDate,
		dueDate,
		setDueDate,
		labels,
		setLabels,
		reporter, // for display in view mode
		handleFieldChange,
		currentUserPermission,
	} = useTaskModalStore();
	const { user } = useUser();

	const today = new Date().toISOString().split("T")[0];

	// For standardizing field update calls
	const handleChange = (
		field: string,
		value: string,
		setter: (val: string) => void,
	) => {
		setter(value);
		if (mode === "view") {
			handleFieldChange(field, value);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Status */}
			<div>
				<label
					htmlFor="status"
					className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
				>
					Status
				</label>
				<select
					id="status"
					value={status}
					onChange={(e) => {
						const selectedStatus = projectData?.statuses.find(
							(s) => s.id === e.target.value,
						);
						setStatus(e.target.value);
						if (mode === "view" && selectedStatus) {
							// Update backend with ID
							handleFieldChange("statusId", e.target.value);
							// Update local optimistic UI with Name
							handleFieldChange("status", selectedStatus.name);
						}
					}}
					className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
					disabled={isLoading}
				>
					{isLoading ? (
						<option value="">Loading statuses...</option>
					) : projectData?.statuses.length ? (
						projectData.statuses.map((s) => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))
					) : (
						<option value="">No statuses</option>
					)}
				</select>
			</div>

			{/* Member (Assignee) */}
			<div>
				<label
					htmlFor="team"
					className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
				>
					Member
				</label>
				<select
					id="team"
					value={assignee}
					onChange={(e) =>
						handleChange("assigneeId", e.target.value, setAssignee)
					}
					className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
					disabled={
						isLoading ||
						(currentUserPermission !== "administrator" && mode === "view")
					}
				>
					<option value="">Select team member...</option>
					{!isLoading &&
						projectData?.members.map((m) => (
							<option key={m.userId} value={m.userId}>
								{m.name}
							</option>
						))}
				</select>
			</div>

			{/* Assignee & Priority Row */}
			<div className="grid grid-cols-1 gap-4">
				<div>
					<div className="flex items-center justify-between mb-1.5">
						<label
							htmlFor="priority"
							className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
						>
							Priority
						</label>
						{onOpenAddPriority && (
							<button
								type="button"
								onClick={onOpenAddPriority}
								className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
							>
								<Flag size={12} /> Add Priority
							</button>
						)}
					</div>
					<select
						id="priority"
						value={priority}
						onChange={(e) =>
							handleChange("priority", e.target.value, setPriority)
						}
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						disabled={
							isLoading ||
							(currentUserPermission !== "administrator" && mode === "view")
						}
					>
						{isLoading ? (
							<option value="">Loading priorities...</option>
						) : projectData?.priorities?.length ? (
							projectData.priorities.map((p) => (
								<option key={p} value={p}>
									{p.charAt(0).toUpperCase() + p.slice(1)}
								</option>
							))
						) : (
							<option value="low">Low</option>
						)}
					</select>
				</div>
			</div>

			{/* Start Date & Due Date Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="startDate"
						className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
					>
						Start Date
					</label>
					<input
						id="startDate"
						type="date"
						min={mode === "create" ? today : undefined}
						value={startDate}
						onChange={(e) => {
							handleChange("startDate", e.target.value, setStartDate);
							if (dueDate && e.target.value > dueDate) {
								handleChange("dueDate", e.target.value, setDueDate);
							}
						}}
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						disabled={
							currentUserPermission !== "administrator" && mode === "view"
						}
					/>
				</div>

				<div>
					<label
						htmlFor="dueDate"
						className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
					>
						Due Date
					</label>
					<input
						id="dueDate"
						type="date"
						min={startDate || (mode === "create" ? today : undefined)}
						value={dueDate}
						onChange={(e) =>
							handleChange("dueDate", e.target.value, setDueDate)
						}
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						disabled={
							currentUserPermission !== "administrator" && mode === "view"
						}
					/>
				</div>
			</div>

			{/* Labels Row */}
			<div className="grid grid-cols-1 gap-4">
				<div>
					<div className="flex items-center justify-between mb-1.5">
						<label
							htmlFor="labels"
							className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
						>
							Labels
						</label>
						{onOpenAddLabel && (
							<button
								type="button"
								onClick={onOpenAddLabel}
								className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
							>
								<Tag size={12} /> Add Label
							</button>
						)}
					</div>
					{mode === "create" || projectData?.labels?.length ? (
						<select
							id="labels"
							value={labels}
							onChange={(e) => handleChange("label", e.target.value, setLabels)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
							disabled={
								isLoading ||
								(currentUserPermission !== "administrator" && mode === "view")
							}
						>
							<option value="">Select label...</option>
							{!isLoading &&
								projectData?.labels.map((l) => (
									<option key={l.name} value={l.name}>
										{l.name}
									</option>
								))}
						</select>
					) : (
						<input
							type="text"
							value={labels}
							onChange={(e) =>
								setLabels(e.target.value.replace(/\s{2,}/g, " "))
							}
							onBlur={() => handleChange("label", labels, setLabels)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
							disabled={
								currentUserPermission !== "administrator" && mode === "view"
							}
						/>
					)}
				</div>
			</div>

			{/* Reporter */}
			<div>
				<label
					htmlFor="reporter"
					className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
				>
					Reporter
				</label>
				{mode === "create" ? (
					<div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5">
						{user?.imageUrl ? (
							<Image
								src={user.imageUrl}
								alt="Reporter"
								width={20}
								height={20}
								className="rounded-full"
							/>
						) : (
							<div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold uppercase">
								{user?.firstName?.charAt(0) ||
									user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
									"?"}
							</div>
						)}
						<span className="text-sm font-medium text-slate-900 dark:text-white">
							{user?.fullName ||
								user?.primaryEmailAddress?.emailAddress ||
								"Loading..."}
						</span>
					</div>
				) : (
					<div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5">
						<span className="text-sm font-medium text-slate-900 dark:text-white">
							{reporter || "Unknown"}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
