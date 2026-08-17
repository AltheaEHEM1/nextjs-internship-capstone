"use client";

import {
	Calendar,
	Clock,
	Code2,
	FileText,
	GanttChart,
	Kanban,
	ListTodo,
	User,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { useCustomProjectNavigationStore } from "../../stores/project/custom-project-navigation-store";

export default function ProjectNavigation({
	projectId,
	projectViews,
}: {
	projectId?: string;
	projectViews?: string[];
}) {
	const params = useParams() as { id?: string } | undefined;
	const id = projectId ?? params?.id;
	const pathname = usePathname() ?? "";

	if (pathname?.includes("/project-settings")) return null;

	const allNavItems = [
		{ label: "Dashboard", icon: User, slug: "summary" },
		{ label: "List", icon: ListTodo, slug: "list" },
		{ label: "Board", icon: Kanban, slug: "" },
		{ label: "Calendar", icon: Calendar, slug: "calendar" },
		{ label: "Whiteboard", icon: FileText, slug: "whiteboard" },
		{ label: "Gantt Chart", icon: GanttChart, slug: "gantt-chart" },
		{ label: "Timeline", icon: Clock, slug: "timeline" },
	];

	const navItems = projectViews
		? allNavItems.filter(item =>
			item.label === "Dashboard" ||
			projectViews.some(v => v.toLowerCase() === item.label.toLowerCase())
		)
		: allNavItems;

	const buildHref = (slug: string) => {
		if (id) return `/projects/${id}${slug ? `/${slug}` : ""}`;
		return `/projects/pages${slug ? `/${slug}` : ""}`;
	};

	const normalize = (p: string) =>
		p.replace(/\/+$|^$/g, "").replace(/\/+/g, "/");

	return (
		<div className="border-b border-french_gray-200 dark:border-payne's_gray-700">
			<nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none">
				{navItems.map((item) => {
					const href = buildHref(item.slug);
					const current = normalize(pathname);
					const target = normalize(href);
					const isActive =
						item.slug === ""
							? current === target
							: current === target ||
							(current.startsWith(target) &&
								(current.length === target.length ||
									current.charAt(target.length) === "/"));

					return (
						<Link
							key={item.label}
							href={href}
							className={`flex whitespace-nowrap items-center border-b-2 px-1 py-3 text-sm font-medium transition-colors ${isActive
								? "border-blue_munsell-600 text-blue_munsell-700 dark:border-blue_munsell-400 dark:text-blue_munsell-300"
								: "border-transparent text-outer_space-500 hover:border-french_gray-400 hover:text-outer_space-700 dark:text-platinum-500 dark:hover:border-payne's_gray-300 dark:hover:text-platinum-300"
								}`}
						>
							<item.icon className="mr-2" size={16} />
							{item.label}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
