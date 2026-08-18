"use client";

import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateProject1 from "@/components/modals/project/CreateProject1Modal";
import CreateProject2 from "@/components/modals/project/CreateProject2Modal";
import { PageHeader } from "@/components/page-header/PageHeader";
import { getProjectsAction } from "@/actions/project/Project";
import { useProject } from "@/hooks/project/useProject";

function getPlaceholderStats(id: number) {
	const daysLeft = ((id * 7 + 13) % 30) + 1;
	const members = ((id * 3 + 5) % 8) + 2;
	const tasks = ((id * 11 + 7) % 20) + 5;
	const progress = ((id * 17 + 23) % 80) + 20;
	return { daysLeft, members, tasks, progress };
}

export default function ProjectsPage() {
	const {
		modalStep,
		projectName,
		setProjectName,
		description,
		setDescription,
		access,
		setAccess,
		team,
		setTeam,
		dueDate,
		setDueDate,
		handleOpen,
		handleClose,
		handleNext,
		handleBack,
		handleCreateFinal,
	} = useProject();

	const [projects, setProjects] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchProjects = async () => {
		const result = await getProjectsAction();
		if (result.success && result.data) {
			setProjects(result.data);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	// Refresh when a new project is created
	const onProjectCreated = async (data: any) => {
		await handleCreateFinal(data);
		await fetchProjects();
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<PageHeader
					title="Projects"
					description="Manage and organize your team projects"
				/>
				<button
					type="button"
					onClick={handleOpen}
					className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e9b65] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
				>
					<Plus size={18} />
					Add Project
				</button>

				{/* Modal Step 1 */}
				<CreateProject1
					opened={modalStep === "step1"}
					onClose={handleClose}
					projectName={projectName}
					setProjectName={setProjectName}
					description={description}
					setDescription={setDescription}
					access={access}
					setAccess={setAccess}
					team={team}
					setTeam={setTeam}
					dueDate={dueDate}
					setDueDate={setDueDate}
					onNext={handleNext}
				/>

				{/* Modal Step 2 */}
				<CreateProject2
					opened={modalStep === "step2"}
					onClose={handleClose}
					onBack={handleBack}
					onCreate={onProjectCreated}
				/>
			</div>


			{/* Search and Filter Bar */}
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 transform text-payne's_gray-500 dark:text-french_gray-400"
						size={16}
					/>
					<input
						type="text"
						placeholder="Search projects..."
						className="w-full rounded-lg border border-french_gray-300 bg-white py-2 pl-10 pr-4 text-outer_space-500 placeholder-payne's_gray-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 dark:border-payne's_gray-400 dark:bg-outer_space-500 dark:text-platinum-500 dark:placeholder-french_gray-400"
					/>
				</div>
				<button
					type="button"
					className="inline-flex items-center rounded-lg border border-french_gray-300 px-4 py-2 text-outer_space-500 transition-colors hover:bg-platinum-500 dark:border-payne's_gray-400 dark:text-platinum-500 dark:hover:bg-payne's_gray-400"
				>
					<Filter size={16} className="mr-2" />
					Filter
				</button>
			</div>

			{/* Projects Grid Placeholder */}
			{
				isLoading ? (
					<div className="flex h-48 items-center justify-center text-sm text-gray-500">
						Loading projects...
					</div>
				) : projects.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center dark:border-gray-800">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							No projects found. Click "Add Project" to get started.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{projects.map((project) => {
							const { progress } = getPlaceholderStats(
								project.id?.charCodeAt(0) || 1,
							);

							return (
								<Link
									key={project.id}
									href={`/projects/${project.id}`}
									className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-b from-gray-50/50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200/80 dark:border-gray-800/60 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-900/50 dark:hover:shadow-blue-500/10 dark:hover:border-blue-500/30"
								>
									{/* Subtle background flair */}
									<div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10 dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20" />

									<div className="relative">
										{/* Header: Team Name & Due Date */}
										<div className="mb-5 flex items-center justify-between">
											<div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-700 backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/50 dark:text-gray-300">
												<span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
												{project.teamName || "Personal"}
											</div>

											<div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
												<svg
													className="h-3.5 w-3.5 opacity-75"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												{new Date(project.dueDate).toLocaleDateString(undefined, {
													month: "short",
													day: "numeric",
												})}
											</div>
										</div>

										{/* Title */}
										<h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
											{project.name}
										</h3>

										{/* Description */}
										<p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
											{project.description || "No description provided."}
										</p>
									</div>

									{/* Footer Section */}
									<div className="relative mt-auto flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800/80">
										<div className="flex items-center justify-between">
											{/* Accurate Member Avatars */}
											<div className="flex -space-x-2">
												<div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm dark:ring-gray-900 uppercase">
													{(project.teamName || "P").charAt(0)}
												</div>
												{project.memberCount > 1 && (
													<div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-600 ring-2 ring-white shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-900">
														+{project.memberCount - 1}
													</div>
												)}
											</div>
										</div>

										{/* Progress Bar */}
										<div className="w-full">
											<div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
												<span className="text-gray-500 dark:text-gray-400">Progress</span>
												<span className="text-gray-900 dark:text-gray-200">{progress}%</span>
											</div>
											<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner dark:bg-gray-800">
												<div
													className="relative h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out dark:from-blue-600 dark:to-indigo-600 overflow-hidden group-hover:from-blue-400 group-hover:to-indigo-400"
													style={{ width: `${progress}%` }}
												>
													<div className="absolute inset-0 w-[200%] translate-x-[-100%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-1000 group-hover:translate-x-[100%]"></div>
												</div>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}



		</div>
	);
}
