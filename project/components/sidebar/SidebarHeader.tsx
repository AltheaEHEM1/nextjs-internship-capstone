"use client";

import React from "react";
import { Menu, Search, Bell, Moon, Sun } from "lucide-react";
import { Breadcrumbs } from "@/components/bread-crumbs/BreadCrumbs";
import { useTheme } from "@/components/theme-provider";

interface SidebarHeaderProps {
    onMenuClick: () => void;
    blogHref?: string;
    onLogout?: () => void;
}

export default function SidebarHeader({
    onMenuClick,
    blogHref = "/blog_admin",
    onLogout,
}: SidebarHeaderProps) {
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            console.log("Logging out...");
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-x-4 border-b border-french_gray-300 px-4 transition-colors duration-200 dark:border-payne's_gray-400 bg-platinum-900 dark:bg-outer_space-600 sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Left Section: Mobile Menu Trigger */}
            <div className="flex items-center gap-x-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-outer_space-500 transition-all duration-150 hover:bg-platinum-500 active:scale-95 dark:text-platinum-500 dark:hover:bg-payne's_gray-400 lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu size={20} />
                </button>
                <Breadcrumbs />
            </div>

            {/* Middle Section: Search Bar */}
            <div className="flex flex-1 max-w-md items-center">
                <div className="relative w-full">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-payne's_gray-400 dark:text-french_gray-400"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search projects, tasks..."
                        className="w-full rounded-xl border border-french_gray-300 bg-platinum-500/50 py-2 pl-10 pr-4 text-sm text-outer_space-500 placeholder-payne's_gray-400 transition-all duration-200 focus:border-blue_munsell-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue_munsell-500/20 dark:border-payne's_gray-300 dark:bg-payne's_gray-400/50 dark:text-platinum-500 dark:placeholder-french_gray-400 dark:focus:bg-payne's_gray-400"
                    />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-x-2 sm:gap-x-3">
                {/* Notifications Button */}
                <button 
                    className="relative rounded-xl p-2.5 text-outer_space-500 transition-all duration-150 hover:bg-platinum-500 active:scale-95 dark:text-platinum-500 dark:hover:bg-payne's_gray-400"
                    aria-label="View notifications"
                >
                    <Bell size={18} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue_munsell-500 ring-2 ring-white dark:ring-outer_space-600" />
                </button>

                {/* Theme Toggle Button */}
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="rounded-xl p-2.5 text-outer_space-500 transition-all duration-150 hover:bg-platinum-500 active:scale-95 dark:text-platinum-500 dark:hover:bg-payne's_gray-400"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* Divider */}
                <div className="h-6 w-[1px] bg-french_gray-300 dark:bg-payne's_gray-400 mx-1" />

                {/* User Avatar */}
                <div className="flex items-center gap-x-3 pl-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue_munsell-500 to-blue-600 text-sm font-bold shadow-sm shadow-blue_munsell-500/20 text-white transition-transform hover:scale-105">
                        U
                    </div>
                </div>
            </div>
        </header>
    );
}
