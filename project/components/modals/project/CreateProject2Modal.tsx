"use client";

import {
	ArrowLeft,
	Check,
	ChevronRight,
	SlidersHorizontal,
} from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";
import CustomStatus from "@/components/modals/project/CustomStatusModal";
import CustomView from "@/components/modals/project/CustomViewModal";
import { useCreateProjectWorkflow } from "@/hooks/project/useCreateProjectWorkflow";

interface CreateProject2Props {
	opened: boolean;
	onClose: () => void;
	onBack: () => void;
	onCreate: (workflowData: any) => void;
}

export default function CreateProject2({
	opened,
	onClose,
	onBack,
	onCreate,
}: CreateProject2Props) {
	const {
		workflow,
		activeSubView,
		views,
		statuses,
		setViews,
		setStatuses,
		handleWorkflowChange,
		setActiveSubView,
		handleFinalCreate,
	} = useCreateProjectWorkflow("starter");

	const handleCreate = () => onCreate(handleFinalCreate());

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					{activeSubView !== "main" ? (
						<button
							type="button"
							onClick={() => setActiveSubView("main")}
							className="rounded-lg p-1 hover:bg-gray-100 transition dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
						>
							<ArrowLeft size={20} />
						</button>
					) : (
						<SlidersHorizontal size={22} style={{ color: "#1e9b65" }} />
					)}
					<span>
						{activeSubView === "main" && "Workflow & Statuses"}
						{activeSubView === "views" && "Default settings for views"}
						{activeSubView === "statuses" && "Task Statuses"}
					</span>
				</div>
			}
			footer={
				<>
					{activeSubView === "main" ? (
						<>
							<button
								type="button"
								onClick={onBack}
								className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition dark:text-gray-300 dark:hover:bg-gray-800"
							>
								Back
							</button>
							<button
								type="button"
								onClick={handleFinalCreate}
								className="rounded-lg bg-[#1e9b65] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition"
							>
								Create Project
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => setActiveSubView("main")}
							className="w-full rounded-lg bg-[#1e9b65] py-2 text-sm font-medium text-white shadow hover:opacity-90 transition text-center"
						>
							Done
						</button>
					)}
				</>
			}
		>
			{activeSubView === "main" && (
				<div className="space-y-6">
					{/* Workflow Selection */}
					<div>
						<label
							htmlFor="workflow"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Select Workflow Option
						</label>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div
								role="button"
								tabIndex={0}
								onClick={() => handleWorkflowChange("starter")}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleWorkflowChange("starter");
									}
								}}
								className={`cursor-pointer rounded-xl border p-4 transition ${
									workflow === "starter"
										? "border-[#1e9b65] bg-[#1e9b65]/5 ring-1 ring-[#1e9b65]"
										: "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
								}`}
							>
								<div className="flex items-center justify-between mb-1">
									<span className="font-semibold text-sm text-gray-900 dark:text-white">
										1. Starter
									</span>
									{workflow === "starter" && (
										<Check size={16} className="text-[#1e9b65]" />
									)}
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Default views: List & Board. Click below to customize views.
								</p>
							</div>

							<div
								role="button"
								tabIndex={0}
								onClick={() => handleWorkflowChange("project_management")}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleWorkflowChange("project_management");
									}
								}}
								className={`cursor-pointer rounded-xl border p-4 transition ${
									workflow === "project_management"
										? "border-[#1e9b65] bg-[#1e9b65]/5 ring-1 ring-[#1e9b65]"
										: "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
								}`}
							>
								<div className="flex items-center justify-between mb-1">
									<span className="font-semibold text-sm text-gray-900 dark:text-white">
										2. Project Management
									</span>
									{workflow === "project_management" && (
										<Check size={16} className="text-[#1e9b65]" />
									)}
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Default views: List, Board, Calendar, Gantt, Team. Fully
									customizable.
								</p>
							</div>
						</div>
					</div>

					{/* Navigation Cards Container */}
					<div className="space-y-3">
						<label
							htmlFor="workflow"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Customize Defaults for{" "}
							{workflow === "starter" ? "Starter" : "Project Management"}
						</label>

						{/* Clickable View Trigger Card */}
						<div
							role="button"
							tabIndex={0}
							onClick={() => setActiveSubView("views")}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setActiveSubView("views");
								}
							}}
							className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#1e9b65] dark:border-gray-700 dark:bg-gray-800"
						>
							<div>
								<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
									Default Views
								</h4>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{views.join(", ")}
								</p>
							</div>
							<ChevronRight
								size={18}
								className="text-gray-400 transition group-hover:text-[#1e9b65]"
							/>
						</div>

						{/* Clickable Status Trigger Card */}
						<div
							role="button"
							tabIndex={0}
							onClick={() => setActiveSubView("statuses")}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setActiveSubView("statuses");
								}
							}}
							className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#1e9b65] dark:border-gray-700 dark:bg-gray-800"
						>
							<div>
								<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
									Task Statuses
								</h4>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{statuses.notStarted.length +
										statuses.active.length +
										statuses.done.length +
										statuses.closed.length}{" "}
									total statuses configured
								</p>
							</div>
							<ChevronRight
								size={18}
								className="text-gray-400 transition group-hover:text-[#1e9b65]"
							/>
						</div>
					</div>
				</div>
			)}

			{/*Custom Views Modal */}
			<CustomView
				opened={activeSubView === "views"}
				onClose={() => setActiveSubView("main")}
				selectedViews={views}
				onChangeViews={setViews}
			/>

			{/* Custom Statuses Modal */}
			<CustomStatus
				opened={activeSubView === "statuses"}
				onClose={() => setActiveSubView("main")}
				status={statuses}
				onChangeStatus={setStatuses}
			/>
		</BaseModal>
	);
}
