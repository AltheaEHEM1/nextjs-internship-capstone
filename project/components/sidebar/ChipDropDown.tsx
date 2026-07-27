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
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                    !noBackground && "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm",
                    "text-sm font-medium",
                )}
            >
                {!disableIcon && <User size={18} className="text-slate-500" />}
                <span className={cn(hideLabelsOnMobile && "hidden sm:inline")}>
                    {children}
                </span>
            </button>

            {isOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-outer_space-600 border border-slate-300/60 dark:border-white/10 rounded-xl shadow-xl py-1 z-50 text-slate-900 dark:text-slate-100 font-['Poppins',sans-serif]">
                    {onProfileClick && (
                        <button
                            type="button"
                            onClick={() => {
                                onProfileClick();
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
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
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
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
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}