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
			"relative block w-full rounded-lg p-3 transition-all duration-200 hover:bg-black/10",
			active
				? "bg-black/20 text-black"
				: isOpened
					? "bg-black/5 text-black/70"
					: "bg-transparent text-black/70",
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
						<div className="flex items-center gap-2">
							<Icon size={20} className="opacity-90" />
							{!isNarrow && (
								<span className="text-[14px]">{item.label}</span>
							)}
						</div>
						{!isNarrow && (
							<ChevronDown
								size={18}
								className={cn(
									"transition-transform duration-200",
									opened ? "rotate-180" : "rotate-0",
								)}
							/>
						)}
					</div>
				</button>

				{opened && (
					<div className="overflow-hidden">
						<div className="flex flex-col gap-2 mt-2 pl-10">
							{item.links
								.filter(
									(sub) => !sub.roles || (role && sub.roles.includes(role)),
								)
								.map((sub) => {
									const SubIcon = sub.icon;
									return (
										<Link
											key={sub.link}
											href={`/${sub.link}`}
											onClick={onClose}
											className={cn(
												navButtonClasses(isActive(sub.link || ""), false),
												"py-2.5 px-3",
											)}
										>
											<div className="flex items-center gap-3">
												<SubIcon size={16} className="opacity-90" />
												<span className="text-[14px]">{sub.label}</span>
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
					isNarrow ? "justify-center" : "justify-start gap-4",
				)}
			>
				<Icon
					size={isNarrow ? 22 : 20}
					className={cn(
						"transition-colors opacity-90",
						active ? "text-black" : "text-black/70",
					)}
				/>
				{!isNarrow && (
					<span className="text-[14px]">{item.label}</span>
				)}
			</div>
		</Link>
	);
}
