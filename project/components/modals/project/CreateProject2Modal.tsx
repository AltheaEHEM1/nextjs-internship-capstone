"use client";

import { ArrowLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";
import CustomStatus from "@/components/modals/project/CustomStatusModal";
import { useCreateProjectWorkflow } from "@/hooks/project/useCreateProjectWorkflow";

interface CreateProject2Props {
	opened: boolean;
	onClose: () => void;
	onBack: () => void;
	onCreate: (workflowData: Record<string, unknown>) => void;
}

export default function CreateProject2({
	opened,
	onClose,
	onBack,
	onCreate,
}: CreateProject2Props) {
	const {
		activeSubView,
		statuses,
		AVAILABLE_VIEWS,
		setStatuses,
		setActiveSubView,
		handleFinalCreate,
	} = useCreateProjectWorkflow();

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
				activeSubView === "main" ? (
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
							onClick={handleCreate}
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
				)
			}
		>
			{activeSubView === "main" && (
				<div className="space-y-6">
					{/* Views Selection */}
					<div>
						<label
							htmlFor="views"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Available Project Views
						</label>
						<div className="flex flex-wrap gap-2">
							{AVAILABLE_VIEWS.map((view) => (
								<div
									key={view}
									className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
								>
									{view}
								</div>
							))}
						</div>
					</div>

					{/* Navigation Cards Container */}
					<div className="space-y-3">
						<label
							htmlFor="settings"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Customize Settings
						</label>

						{/* Clickable Status Trigger Card */}
						<button
							type="button"
							onClick={() => setActiveSubView("statuses")}
							className="group flex cursor-pointer w-full text-left items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#1e9b65] dark:border-gray-700 dark:bg-gray-800"
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
						</button>
					</div>
				</div>
			)}

			{/* Custom Statuses Modal */}
			<CustomStatus
				opened={activeSubView === "statuses"}
				onClose={() => setActiveSubView("main")}
				status={statuses}
				onChangeStatus={(status) =>
					setStatuses(status as unknown as typeof statuses)
				}
			/>
		</BaseModal>
	);
}
