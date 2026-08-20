"use client";

import { CheckSquare, FolderKanban, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TaskModal from "@/components/modals/task/TaskModal";
import { useCustomProjectHeaderStore } from "../../stores/project/custom-project-header-store";

export interface ProjectHeaderProps {
	title: string;
	projectId: string;
	onOpenSettings?: () => void;
	onOpenAddPriority?: () => void;
	onOpenAddLabel?: () => void;
}

export default function ProjectHeader({
	title,
	projectId,
	onOpenAddPriority,
	onOpenAddLabel,
}: ProjectHeaderProps) {
	const router = useRouter();
	const { isCreateTaskOpen, setIsCreateTaskOpen, handleSettings, setNavigate } =
		useCustomProjectHeaderStore();

	// Inject Next.js router into the store for navigation
	useEffect(() => {
		setNavigate(router.push);
	}, [router, setNavigate]);

	return (
		<>
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start space-x-3.5">
					<span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue_munsell-500/10 text-blue_munsell-600 dark:text-blue_munsell-400">
						<FolderKanban size={24} />
					</span>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-outer_space-800 sm:text-3xl dark:text-platinum-100">
							{title}
						</h1>
					</div>
				</div>

				{/* Right side icons */}
				<div className="flex items-center space-x-3">
					{/* Create Task Button */}
					<div className="relative group">
						<button
							type="button"
							onClick={() => setIsCreateTaskOpen(true)}
							className="inline-flex items-center justify-center rounded-lg border border-french_gray-300 bg-white p-2 text-outer_space-700 shadow-2xs transition-colors hover:bg-french_gray-50 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-payne's_gray-400"
							aria-label="Create Task"
						>
							<CheckSquare
								size={16}
								className="text-outer_space-400 dark:text-platinum-400"
							/>
						</button>
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex px-2 py-1 text-[10px] font-medium text-white bg-outer_space-800 dark:bg-outer_space-900 rounded-md shadow-md whitespace-nowrap z-30 pointer-events-none">
							Create Task
						</div>
					</div>

					{/* Settings Button */}
					<div className="relative group">
						<button
							type="button"
							onClick={() => handleSettings(projectId)}
							className="inline-flex items-center justify-center rounded-lg border border-french_gray-300 bg-white p-2 text-outer_space-700 shadow-2xs transition-colors hover:bg-french_gray-50 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-payne's_gray-400"
							aria-label="Project Settings"
						>
							<Settings
								size={18}
								className="text-outer_space-400 dark:text-platinum-400"
							/>
						</button>
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex px-2 py-1 text-[10px] font-medium text-white bg-outer_space-800 dark:bg-outer_space-900 rounded-md shadow-md whitespace-nowrap z-30 pointer-events-none">
							Project Settings
						</div>
					</div>
				</div>
			</header>

			{/* Task Modal (Create) */}
			{isCreateTaskOpen && (
				<TaskModal
					mode="create"
					opened={isCreateTaskOpen}
					onClose={() => setIsCreateTaskOpen(false)}
					onOpenAddPriority={onOpenAddPriority}
					onOpenAddLabel={onOpenAddLabel}
					projectId={projectId}
				/>
			)}
		</>
	);
}
