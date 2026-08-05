"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useState } from "react"; // removed, using Zustand store
import { useCustomSidebarHeaderStore } from "../../stores/components/custom-sidebar-header-store";

// removed top-level store hook

import { Breadcrumbs } from "@/components/bread-crumbs/BreadCrumbs";
import { useTheme } from "@/components/theme-color/ThemeProvider";

interface SidebarHeaderProps {
	onMenuClick: () => void;
	onLogout?: () => void;
}

export default function SidebarHeader({
	onMenuClick,
	onLogout,
}: SidebarHeaderProps) {
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useCustomSidebarHeaderStore();

	const handleLogout = () => {
		if (onLogout) {
			onLogout();
		} else {
			console.log("Logging out...");
		}
	};

	return (
		<header className="shadow-xs sticky top-0 z-30 flex flex-shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-3 border-b border-slate-200 bg-white px-4 py-2 text-slate-700 transition-colors duration-200 sm:gap-x-6 sm:px-6 lg:px-8">
			{/* Mobile Menu Trigger & Breadcrumbs */}
			<div className="flex items-center gap-x-4">
				<button
					onClick={onMenuClick}
					className="rounded-lg p-2 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95 lg:hidden"
					aria-label="Open sidebar"
				>
					<Menu size={20} />
				</button>
				<Breadcrumbs />
			</div>

			{/* Right Section: Actions & Profile */}
			<div className="flex items-center gap-x-2 sm:gap-x-3">
				<div className="relative flex items-center">
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "w-64 opacity-100 mr-2" : "w-0 opacity-0"
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

				{/* Theme Toggle Button */}
				<button
					onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					className="rounded-xl p-2.5 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
					aria-label="Toggle theme"
				>
					{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
				</button>

				<UserButton />
			</div>
		</header>
	);
}
