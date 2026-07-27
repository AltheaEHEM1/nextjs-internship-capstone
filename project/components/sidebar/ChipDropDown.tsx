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
}

export default function ChipDropdown({
    onLogout,
    onProfileClick,
    onSettingsClick,
	children,
	noBackground = false,
	hideLabelsOnMobile = false,
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
					"flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
					!noBackground && "bg-slate-100 hover:bg-slate-200",
					"text-sm font-medium text-slate-700",
				)}
			>
				<User size={18} />
				<span className={cn(hideLabelsOnMobile && "hidden sm:inline")}>
					{children}
				</span>
			</button>

			{isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                    {onProfileClick && (
                        <button
                            type="button"
                            onClick={() => {
                                onProfileClick();
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
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
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
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
						className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
