import type { IconType } from "react-icons";
import {
	FaBell,
	FaCog,
	FaFolderOpen,
	FaHome,
	FaLock,
	FaPaintBrush,
	FaUser,
	FaUsers,
} from "react-icons/fa";

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
				link: "team",
				label: "People",
				description: "View all people",
				icon: FaUsers,
			},
			{
				link: "team/your-teams",
				label: "Your Teams",
				description: "View your specific teams",
				icon: FaFolderOpen,
			},
		],
	},
	{
		link: "settings",
		label: "Settings",
		description: "Manage your settings",
		icon: FaCog,
		current: false,
		links: [
			{
				link: "settings",
				label: "Profile",
				description: "Manage your profile",
				icon: FaUser,
			},
			{
				link: "settings/notifications",
				label: "Notifications",
				description: "Manage notification preferences",
				icon: FaBell,
			},
			{
				link: "settings/security",
				label: "Security",
				description: "Manage security settings",
				icon: FaLock,
			},
			{
				link: "settings/appearance",
				label: "Appearance",
				description: "Manage appearance theme",
				icon: FaPaintBrush,
			},
		],
	},
];
