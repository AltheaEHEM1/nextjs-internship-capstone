"use client";

import BaseModal from "@/components/layout/BaseModal";
import ViewTaskModalLeft from "./ViewTaskModalLeft";
import ViewTaskModalRight from "./ViewTaskModalRight";

interface ViewTaskProps {
	opened: boolean;
	onClose: () => void;
	taskData: {
		workType: string;
		title: string;
		description: string;
		status: string;
		assignee: string;
		priority: "low" | "medium" | "high";
		dueDate: string;
		label: string;
		startDate: string;
		reporter: string;
	};
	onUpdateTask?: (updatedFields: Record<string, unknown>) => void;
}

export default function ViewTask({
	opened,
	onClose,
	taskData,
	onUpdateTask,
}: ViewTaskProps) {
	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={850}
			title={
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
					<span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
						{taskData.workType}
					</span>
					<span>• Task Details</span>
				</div>
			}
		>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-1">
				{/* ================= LEFT SIDE (2 Columns) ================= */}
				<div className="md:col-span-2 space-y-6">
					<ViewTaskModalLeft taskData={taskData} onUpdateTask={onUpdateTask} />
				</div>

				{/* ================= RIGHT SIDE (1 Column) ================= */}
				<div className="space-y-5 bg-gray-50/70 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
					<ViewTaskModalRight taskData={taskData} onUpdateTask={onUpdateTask} />
				</div>
			</div>
		</BaseModal>
	);
}
