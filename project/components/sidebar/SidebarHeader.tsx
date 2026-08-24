"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Menu, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

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
	const _router = useRouter();

	const _handleLogout = () => {
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
					type="button"
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
				{/* Theme Toggle Button */}
				<button
					type="button"
					onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					className="rounded-xl p-2.5 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
					aria-label="Toggle theme"
				>
					{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
				</button>

				<ClerkLoading>
					<div className="h-7 w-7 rounded-full bg-slate-200 animate-pulse" />
				</ClerkLoading>
				<ClerkLoaded>
					<UserButton />
				</ClerkLoaded>
			</div>
		</header>
	);
}
