"use client";

import { FolderKanban, Search, UserCheck } from "lucide-react";
import { useState } from "react";

export interface ProjectHeaderProps {
	title: string;
	projectId: string;
}

export default function ProjectHeader({
	title,
	projectId,
}: ProjectHeaderProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-start space-x-3.5">
				<span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue_munsell-500/10 text-blue_munsell-600 dark:text-blue_munsell-400">
					<FolderKanban size={24} />
				</span>
				<div>
					<span className="mb-1 inline-block text-xs font-semibold tracking-wider text-blue_munsell-600 uppercase dark:text-blue_munsell-400">
						Project ID: {projectId}
					</span>
					<h1 className="text-2xl font-bold tracking-tight text-outer_space-800 sm:text-3xl dark:text-platinum-100">
						{title}
					</h1>
				</div>
			</div>

			{/* Right side: Assignee Button & Expandable Search */}
			<div className="flex items-center space-x-3">
				<button
					type="button"
					className="inline-flex items-center gap-2 rounded-lg border border-french_gray-300 bg-white px-3.5 py-2 text-sm font-medium text-outer_space-700 shadow-2xs transition-colors hover:bg-french_gray-50 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-payne's_gray-400"
				>
					<UserCheck
						size={16}
						className="text-outer_space-400 dark:text-platinum-400"
					/>
					Assignee
				</button>

				<div className="relative flex items-center">
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${
							isSearchOpen ? "w-64 opacity-100 mr-2" : "w-0 opacity-0"
						}`}
					>
						<input
							type="text"
							placeholder="Search tasks..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-lg border border-french_gray-300 bg-white px-3.5 py-2 text-sm text-outer_space-700 shadow-2xs focus:border-blue_munsell-500 focus:outline-none dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200"
						/>
					</div>

					<button
						type="button"
						onClick={() => setIsSearchOpen(!isSearchOpen)}
						className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-french_gray-300 bg-white text-outer_space-700 shadow-2xs transition-colors hover:bg-french_gray-50 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-payne's_gray-400"
						aria-label="Toggle search"
					>
						<Search size={18} />
					</button>
				</div>
			</div>
		</header>
	);
}
