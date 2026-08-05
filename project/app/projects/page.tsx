"use client";

import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import CreateProject1 from "@/components/modals/project/CreateProject1Modal";
import CreateProject2 from "@/components/modals/project/CreateProject2Modal";
import { PageHeader } from "@/components/page-header/PageHeader";
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
		handleOpen,
		handleClose,
		handleNext,
		handleBack,
		handleCreateFinal,
	} = useProject();

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
					onNext={handleNext}
				/>

				{/* Modal Step 2 */}
				<CreateProject2
					opened={modalStep === "step2"}
					onClose={handleClose}
					onBack={handleBack}
					onCreate={handleCreateFinal}
				/>
			</div>

			{/* Implementation Tasks Banner */}
			<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
				<h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
					📋 Projects Page Implementation Tasks
				</h3>
				<ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
					<li>• Task 4.1: Implement project CRUD operations</li>
					<li>• Task 4.2: Create project listing and dashboard interface</li>
					<li>• Task 4.5: Design and implement project cards and layouts</li>
					<li>
						• Task 4.6: Add project and task search/filtering capabilities
					</li>
				</ul>
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
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((i) => {
					const { daysLeft, members, tasks, progress } = getPlaceholderStats(i);
					return (
					<Link
						key={i}
						href={`/projects/pages`}
						className="group rounded-lg border border-french_gray-300 bg-white p-6 transition-shadow hover:shadow-lg dark:border-payne's_gray-400 dark:bg-outer_space-500"
					>
						<div className="mb-4 flex items-start justify-between">
							<div className="h-3 w-3 rounded-full bg-blue_munsell-500"></div>
							<div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
								{daysLeft} days left
							</div>
						</div>

						<h3 className="mb-2 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
							Sample Project {i}
						</h3>

						<p className="mb-4 text-sm text-payne's_gray-500 dark:text-french_gray-400">
							This is a placeholder project description that will be replaced
							with actual project data.
						</p>

						<div className="mb-4 flex items-center justify-between text-sm text-payne's_gray-500 dark:text-french_gray-400">
							<span>{members} members</span>
							<span>{tasks} tasks</span>
						</div>

						<div className="h-2 w-full rounded-full bg-french_gray-300 dark:bg-payne's_gray-400">
							<div
								className="h-2 rounded-full bg-blue_munsell-500"
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</Link>
					);
				})}
			</div>

			{/* Component Placeholders */}
			<div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800/50">
				<h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
					📁 Components to Implement
				</h3>
				<div className="grid grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-2">
					<div>
						<strong>components/project-card.tsx</strong>
						<p>Project display component with progress, members, and actions</p>
					</div>
					<div>
						<strong>components/modals/create-project-modal.tsx</strong>
						<p>Modal for creating new projects with form validation</p>
					</div>
					<div>
						<strong>hooks/use-projects.ts</strong>
						<p>Custom hook for project data fetching and mutations</p>
					</div>
					<div>
						<strong>lib/db/schema.ts</strong>
						<p>Database schema for projects, lists, and tasks</p>
					</div>
				</div>
			</div>
		</div>
	);
}
