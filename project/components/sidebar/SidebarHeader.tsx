"use client";

import React from "react";
import { Menu, Search, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/bread-crumbs/BreadCrumbs";
import { useTheme } from "@/components/theme-color/ThemeProvider";
import ChipDropdown from "@/components/sidebar/ChipDropDown";
import NotificationDropdown from "@/components/notification-dropdown/NotificationDropdown";

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

      {/* Search Bar */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="relative w-full min-w-0">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-x-2 sm:gap-x-3">
        {/* Notifications Component */}
        <NotificationDropdown />

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-xl p-2.5 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-[1px] bg-slate-200" />

        {/* User Avatar / Dropdown */}
        <div className="flex items-center gap-x-3 pl-1">
          <ChipDropdown
            onLogout={handleLogout}
            onProfileClick={() => router.push("/settings")}
            onSettingsClick={() => router.push("/settings")}
            noBackground
            hideLabelsOnMobile
            disableIcon
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm shadow-cyan-500/20 transition-transform hover:scale-105">
              U
            </div>
          </ChipDropdown>
        </div>
      </div>
    </header>
  );
}
