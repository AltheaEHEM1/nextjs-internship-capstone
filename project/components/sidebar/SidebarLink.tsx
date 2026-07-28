"use client";

import { ChevronRight } from "lucide-react";
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
  const active = isActive(item.link || "");

  const baseButtonClasses = cn(
    "relative flex items-center w-full rounded-xl px-3 py-2.5 transition-all duration-200 group text-sm font-medium font-['Poppins',sans-serif]",
  );

  if (item.links) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            baseButtonClasses,
            active || opened
              ? "dark:bg-cyan-500/15 bg-cyan-500/10 font-semibold text-slate-900 dark:text-white"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white",
          )}
        >
          <div
            className={cn(
              "flex w-full items-center",
              isNarrow ? "justify-center" : "justify-between",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  active || opened
                    ? "shadow-xs bg-cyan-500 text-white shadow-cyan-500/30"
                    : "bg-slate-100 text-slate-500 group-hover:bg-cyan-500/20 group-hover:text-cyan-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-cyan-400",
                )}
              >
                <Icon size={16} />
              </div>
              {!isNarrow && (
                <span className="tracking-tight">{item.label}</span>
              )}
            </div>
            {!isNarrow && (
              <ChevronRight
                size={16}
                className={cn(
                  "text-slate-400 transition-transform duration-200",
                  opened
                    ? "rotate-90 text-cyan-600 dark:text-cyan-400"
                    : "rotate-0",
                )}
              />
            )}
          </div>
        </button>

        {opened && !isNarrow && (
          <div className="ml-3 mt-1.5 flex flex-col gap-1 border-l border-slate-200 pl-4 dark:border-slate-800">
            {item.links
              .filter((sub) => !sub.roles || (role && sub.roles.includes(role)))
              .map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isActive(sub.link || "");
                return (
                  <Link
                    key={sub.link}
                    href={`/${sub.link}`}
                    onClick={onClose}
                    className={cn(
                      "group relative flex w-full items-center justify-between rounded-lg px-3 py-2 font-['Poppins',sans-serif] text-xs font-medium transition-all duration-200",
                      isSubActive
                        ? "dark:bg-cyan-500/15 bg-cyan-500/10 font-semibold text-cyan-700 dark:text-cyan-300"
                        : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-white",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <SubIcon
                        size={15}
                        className={cn(
                          "transition-colors",
                          isSubActive
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                        )}
                      />
                      <span className="tracking-tight">{sub.label}</span>
                    </div>
                    {isSubActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
                    )}
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/${item.link}`}
      onClick={onClose}
      className={cn(
        baseButtonClasses,
        active
          ? "dark:bg-cyan-500/15 shadow-2xs bg-cyan-500/10 font-semibold text-cyan-700 dark:text-cyan-300"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white",
      )}
    >
      <div
        className={cn(
          "relative flex w-full items-center",
          isNarrow ? "justify-center" : "justify-start gap-3",
        )}
      >
        {/* Active Indicator Left Pill */}
        {active && !isNarrow && (
          <span className="absolute -left-3.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
        )}
        <div
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            active
              ? "shadow-xs bg-cyan-500 text-white shadow-cyan-500/30"
              : "bg-slate-100 text-slate-500 group-hover:bg-cyan-500/20 group-hover:text-cyan-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-cyan-400",
          )}
        >
          <Icon size={isNarrow ? 18 : 16} />
        </div>
        {!isNarrow && <span className="tracking-tight">{item.label}</span>}
      </div>
    </Link>
  );
}
