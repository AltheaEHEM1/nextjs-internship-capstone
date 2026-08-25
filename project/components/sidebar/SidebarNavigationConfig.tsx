import type { IconType } from "react-icons";
import { FaCog, FaFolderOpen, FaHome, FaUsers } from "react-icons/fa";

export interface NavItem {
	link?: string;
	label: string;
	description: string;
	icon: IconType;
	current?: boolean;
	links?: NavItem[];
	roles?: string[];
}

export const NAV_CONFIG: NavItem[] = [
	{
		link: "dashboard",
		label: "Dashboard",
		description: "View your dashboard",
		icon: FaHome,
		current: true,
	},
	{
		link: "projects",
		label: "Projects",
		description: "Manage your projects",
		icon: FaFolderOpen,
		current: false,
	},
	{
		link: "team",
		label: "Teams",
		description: "Manage your team",
		icon: FaUsers,
		current: false,
		links: [
			{
				link: "team?tab=people",
				label: "People",
				description: "View all people",
				icon: FaUsers,
			},
			{
				link: "team?tab=teams",
				label: "Your Teams",
				description: "View your specific teams",
				icon: FaFolderOpen,
			},
		],
	},
	{
		link: "notification",
		label: "Notifications",
		description: "Manage notification preferences",
		icon: FaCog,
		current: false,
	},
];
