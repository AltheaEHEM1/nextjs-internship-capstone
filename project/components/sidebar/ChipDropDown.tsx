"use client";

import { LogOut, User } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ChipDropdownProps {
	onLogout: () => void;
	onProfileClick?: () => void;
	onSettingsClick?: () => void;
	children: React.ReactNode;
	noBackground?: boolean;
	hideLabelsOnMobile?: boolean;
	disableIcon?: boolean;
}

export default function ChipDropdown({
	onLogout,
	onProfileClick,
	onSettingsClick,
	children,
	noBackground = false,
	hideLabelsOnMobile = false,
	disableIcon = false,
}: ChipDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
					!noBackground &&
						"border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100",
					"text-sm font-medium",
				)}
			>
				{!disableIcon && <User size={18} className="text-slate-500" />}
				<span className={cn(hideLabelsOnMobile && "hidden sm:inline")}>
					{children}
				</span>
			</button>

			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-300/60 bg-white py-1 font-['Poppins',sans-serif] text-slate-900 shadow-xl dark:border-white/10 dark:bg-outer_space-600 dark:text-slate-100">
					{onProfileClick && (
						<button
							type="button"
							onClick={() => {
								onProfileClick();
								setIsOpen(false);
							}}
							className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-900 transition-colors hover:bg-black/5 hover:text-black dark:text-slate-100 dark:hover:bg-white/10 dark:hover:text-white"
						>
							Profile
						</button>
					)}

					{onSettingsClick && (
						<button
							type="button"
							onClick={() => {
								onSettingsClick();
								setIsOpen(false);
							}}
							className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-900 transition-colors hover:bg-black/5 hover:text-black dark:text-slate-100 dark:hover:bg-white/10 dark:hover:text-white"
						>
							Settings
						</button>
					)}

					{(onProfileClick || onSettingsClick) && (
						<div className="my-1 border-t border-slate-100" />
					)}

					<button
						type="button"
						onClick={() => {
							onLogout();
							setIsOpen(false);
						}}
						className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
