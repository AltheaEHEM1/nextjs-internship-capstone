import type { IconType } from "react-icons";
import {
	FaBars,
	FaBell,
	FaCalendar,
	FaChartBar,
	FaCog,
	FaFolderOpen,
	FaHome,
	FaSearch,
	FaTimes,
	FaUsers,
} from "react-icons/fa";

export interface NavItem {
	link: string;
	label: string;
	description: string;
	icon: IconType;
	roles: string[];
	current?: boolean;
	links?: NavItem[];
}

export const NAV_CONFIG: NavItem[] = [
	{
		link: "dashboard",
		label: "Dashboard",
		description: "View your dashboard",
		icon: FaHome,
		roles: ["Admin"],
		current: true,
	},
	{
		link: "projects",
		label: "Projects",
		description: "Manage your projects",
		icon: FaFolderOpen,
		roles: ["Admin"],
		current: false,
	},
	{
		link: "team",
		label: "Team",
		description: "Manage your team",
		icon: FaUsers,
		roles: ["Admin"],
		current: false,
	},
	{
		link: "analytics",
		label: "Analytics",
		description: "View your analytics",
		icon: FaChartBar,
		roles: ["Admin"],
		current: false,
	},
	{
		link: "calendar",
		label: "Calendar",
		description: "View your calendar",
		icon: FaCalendar,
		roles: ["Admin"],
		current: false,
	},
	{
		link: "settings",
		label: "Settings",
		description: "Manage your settings",
		icon: FaCog,
		roles: ["Admin"],
		current: false,
	},
];
