"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "./SidebarNavigationConfig";

interface SidebarLinkProps {
    item: NavItem;
    isActive: (path: string) => boolean;
    isNarrow: boolean;
    role?: string;
    opened?: boolean;
    onToggle: () => void;
    onClose: () => void;
}

export function SidebarLink({
    item,
    isActive,
    isNarrow,
    role,
    opened,
    onToggle,
    onClose,
}: SidebarLinkProps) {
    const Icon = item.icon;

    const navButtonClasses = (active: boolean, isOpened: boolean) =>
        cn(
            "relative block w-full rounded-xl px-3.5 py-2.5 transition-all duration-200 group text-sm font-medium font-['Poppins',sans-serif]",
            active
                ? "bg-cyan-500/15 text-cyan-900 dark:text-cyan-300 border border-cyan-500/30 shadow-xs font-semibold"
                : isOpened
                    ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white"
                    : "bg-transparent text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white",
        );

    const active = isActive(item.link || "");

    if (item.links) {
        return (
            <div className="w-full">
                <button
                    type="button"
                    onClick={onToggle}
                    className={navButtonClasses(active, !!opened && !isNarrow)}
                >
                    <div
                        className={cn(
                            "flex items-center",
                            isNarrow ? "justify-center" : "justify-between",
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Icon 
                                size={18} 
                                className={cn(
                                    "transition-colors",
                                    active ? "text-cyan-700 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                )} 
                            />
                            {!isNarrow && (
                                <span className="tracking-tight">{item.label}</span>
                            )}
                        </div>
                        {!isNarrow && (
                            <ChevronDown
                                size={16}
                                className={cn(
                                    "transition-transform duration-200 text-slate-600 dark:text-slate-400",
                                    opened ? "rotate-180 text-cyan-700 dark:text-cyan-400" : "rotate-0",
                                )}
                            />
                        )}
                    </div>
                </button>

                {opened && !isNarrow && (
                    <div className="overflow-hidden transition-all duration-200">
                        <div className="flex flex-col gap-1 mt-1 pl-4 border-l border-slate-300/60 dark:border-white/10 ml-4">
                            {item.links
                                .filter(
                                    (sub) => !sub.roles || (role && sub.roles.includes(role)),
                                )
                                .map((sub) => {
                                    const SubIcon = sub.icon;
                                    const isSubActive = isActive(sub.link || "");
                                    return (
                                        <Link
                                            key={sub.link}
                                            href={`/${sub.link}`}
                                            onClick={onClose}
                                            className={cn(
                                                "relative block w-full rounded-lg px-3 py-2 transition-all duration-200 text-xs font-medium font-['Poppins',sans-serif] group",
                                                isSubActive
                                                    ? "bg-cyan-500/15 text-cyan-900 dark:text-cyan-300 font-semibold border border-cyan-500/30"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white",
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <SubIcon 
                                                    size={15} 
                                                    className={cn(
                                                        "transition-colors",
                                                        isSubActive ? "text-cyan-700 dark:text-cyan-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                                                    )} 
                                                />
                                                <span className="tracking-tight">{sub.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={`/${item.link}`}
            onClick={onClose}
            className={navButtonClasses(active, false)}
        >
            <div
                className={cn(
                    "flex items-center transition-all duration-300",
                    isNarrow ? "justify-center" : "justify-start gap-3",
                )}
            >
                <Icon
                    size={isNarrow ? 20 : 18}
                    className={cn(
                        "transition-colors",
                        active ? "text-cyan-700 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white",
                    )}
                />
                {!isNarrow && (
                    <span className="tracking-tight">{item.label}</span>
                )}
            </div>
        </Link>
    );
}