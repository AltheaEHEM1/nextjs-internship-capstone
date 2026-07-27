"use client";

import { ChevronLeft, ChevronRight, Copyright, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarLink } from "./SidebarLink";
import { NAV_CONFIG } from "./SidebarNavigationConfig";

interface SidebarProps {
    opened: boolean;
    close: () => void;
    role?: string;
}

export default function Sidebar({ opened, close, role }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openedItems, setOpenedItems] = useState<Record<string, boolean>>({});

    const pathname = usePathname();

    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const isNarrow = collapsed && !isHovered && !isMobile;

    React.useEffect(() => {
        if (isMobile && opened) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, opened]);

    const toggleItem = (label: string) => {
        setOpenedItems((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const NavItems = useMemo(() => {
        if (!role) return NAV_CONFIG;
        return NAV_CONFIG.filter((item) => item.roles.includes(role));
    }, [role]);

    const isActive = (path: string) => {
        const normalizedPath = pathname.replace(/\/$/, "");
        const targetPath = (path.startsWith("/") ? path : `/${path}`).replace(
            /\/$/,
            "",
        );
        if (
            (targetPath === "/dashboard" || targetPath === "/dashboard") &&
            (normalizedPath === "" || normalizedPath === "/")
        ) {
            return true;
        }
        return normalizedPath === targetPath;
    };

    const NavContent = (
        <div
            className={cn(
                "flex flex-col h-full bg-white text-slate-800",
                isNarrow ? "p-2" : "p-3",
            )}
        >
            <div className="px-2 py-3">
                <div
                    className={cn(
                        "flex items-center whitespace-nowrap",
                        isNarrow ? "justify-center" : "justify-between",
                    )}
                >
                    <div
                        className={cn(
                            "flex items-center transition-all duration-300",
                            isNarrow ? "flex-col" : "flex-row",
                        )}
                    >
                        <Link href="/dashboard" className="flex items-center gap-2.5 group py-1">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                                <Image
                                    src="/icon.png"
                                    alt="Projectnify"
                                    width={128}
                                    height={128}
                                    className="relative h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-13"
                                    priority
                                />
                            </div>
                            {!isNarrow && (
                                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Projectnify
                                </span>
                            )}
                        </Link>
                    </div>
                    {isMobile ? (
                        <button
                            type="button"
                            onClick={close}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <X size={18} />
                        </button>
                    ) : (
                        !isNarrow && (
                            <button
                                type="button"
                                onClick={() => setCollapsed(!collapsed)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                            >
                                {collapsed ? (
                                    <ChevronRight size={18} />
                                ) : (
                                    <ChevronLeft size={18} />
                                )}
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className="my-1 w-full border-t border-slate-200" />

            <div
                className={cn(
                    "flex-1 overflow-y-auto no-scrollbar py-2",
                    isNarrow ? "px-0" : "px-1",
                )}
            >
                <div className="flex flex-col space-y-1">
                    {NavItems.map((item) => (
                        <SidebarLink
                            key={item.label}
                            item={item}
                            isActive={isActive}
                            isNarrow={isNarrow}
                            role={role}
                            opened={openedItems[item.label]}
                            onToggle={() => toggleItem(item.label)}
                            onClose={close}
                        />
                    ))}
                </div>
            </div>

            <div className="p-2 mt-auto border-t border-slate-200">
                <div className="flex justify-center items-center opacity-70 text-xs text-slate-600 font-medium">
                    {!isNarrow ? (
                        <div className="flex flex-col items-center text-center">
                            © Projectnify
                        </div>
                    ) : (
                        <Copyright size={16} />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {!isMobile && (
                <aside
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                        "sticky top-0 h-screen transition-all duration-300 z-30 border-r border-slate-200",
                        isNarrow ? "w-20" : "w-64",
                    )}
                >
                    <div className="h-full bg-white overflow-hidden shadow-sm">
                        {NavContent}
                    </div>
                </aside>
            )}

            {isMobile && (
                <>
                    <button
                        type="button"
                        className={cn(
                            "fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 w-full cursor-pointer",
                            opened ? "opacity-100" : "opacity-0 pointer-events-none",
                        )}
                        onClick={close}
                        aria-label="Close sidebar"
                    />
                    <aside
                        className={cn(
                            "fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-45 transition-transform duration-300 shadow-2xl",
                            opened ? "translate-x-0" : "-translate-x-full",
                        )}
                    >
                        {NavContent}
                    </aside>
                </>
            )}
        </>
    );
}