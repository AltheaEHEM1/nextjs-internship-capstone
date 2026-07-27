"use client";

import { ChevronLeft, ChevronRight, Copyright, X } from "lucide-react";
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
				"flex flex-col h-full bg-platinum-900 dark:bg-outer_space-600",
				isNarrow ? "p-2" : "p-4",
			)}
		>
			<div className="p-4">
				<div
					className={cn(
						"flex items-center whitespace-nowrap",
						isNarrow ? "justify-center" : "justify-between",
					)}
				>
					<div
						className={cn(
							"flex items-center gap-3 transition-all duration-300",
							isNarrow ? "flex-col" : "flex-row ml-2",
						)}
					>
						{!isNarrow && (
							<div className="animate-in font-semibold justify-center fade-in slide-in-from-left-2 duration-300 uppercase tracking-widest text-sm">
								Projectnify
							</div>
						)}
					</div>
					{isMobile ? (
						<button
							type="button"
							onClick={close}
							className="p-2 hover:bg-white/10 rounded-full transition-colors text-black"
						>
							<X size={20} />
						</button>
					) : (
						!isNarrow && (
							<button
								type="button"
								onClick={() => setCollapsed(!collapsed)}
								className="p-2 hover:bg-white/10 rounded-full transition-colors text-black"
							>
								{collapsed ? (
									<ChevronRight size={20} />
								) : (
									<ChevronLeft size={20} />
								)}
							</button>
						)
					)}
				</div>
			</div>

			<div className="my-3 w-4/5 mx-auto border-t border-white/20" />

			<div
				className={cn(
					"flex-1 overflow-y-auto no-scrollbar",
					isNarrow ? "px-0" : "px-4",
				)}
			>
				<div className="flex flex-col">
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

			<div className="p-3 mt-auto">
				<div className="flex justify-center items-center opacity-50 text-xs">
					{!isNarrow ? (
						<div className="flex flex-col items-center text-center">
							Projectnify
						</div>
					) : (
						<Copyright size={18} />
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
						"sticky top-0 h-screen transition-all duration-300 z-30",
						isNarrow ? "w-20" : "w-64",
					)}
				>
					<div className="h-full bg-(--color-ft-bg) rounded-r-4xl overflow-hidden shadow-2xl">
						{NavContent}
					</div>
				</aside>
			)}

			{isMobile && (
				<>
					<button
						type="button"
						className={cn(
							"fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 w-full cursor-pointer",
							opened ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
						onClick={close}
						aria-label="Close sidebar"
					/>
					<aside
						className={cn(
							"fixed inset-y-0 left-0 w-75 bg-(--color-ft-bg) z-45 transition-transform duration-300",
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
