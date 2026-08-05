import { useMemo } from "react";

export type FeatureMetric = {
	label: string;
	value: string;
};

export type FeatureModule = {
	moduleLabel: string;
	title: string;
	description: string;
	statusLabel: string;
	features: string[];
};

export type FeatureListModule = {
	moduleLabel: string;
	title: string;
	description: string;
	metaLabel: string;
	items: string[];
};

export function useFeatures() {
	const systemHealth = "99.99%";

	const coreModule = useMemo<FeatureModule & { metrics: FeatureMetric[] }>(
		() => ({
			moduleLabel: "Module 01 • Core Engine",
			title: "Core Workflow Engine",
			description:
				"The primary operations layer handling state persistence, project lifecycles, kanban views, and assignment indexing.",
			statusLabel: "Live & Active",
			metrics: [
				{ label: "Data Latency", value: "< 45ms" },
				{ label: "State Sync", value: "Realtime" },
			],
			features: [
				"User auth & protected routes",
				"Project CRUD engine",
				"Interactive Kanban board",
				"Priority scoring & due dates",
				"Activity audit history",
				"Multi-attribute global fuzzy search",
			],
		}),
		[],
	);

	const teamModule = useMemo<FeatureModule>(
		() => ({
			moduleLabel: "Module 02",
			title: "Team & Workspace Controls",
			description:
				"Manage enterprise permissions, team roles, and multi-tenant notification pipelines.",
			statusLabel: "In Development",
			features: [
				"Team onboarding & invites",
				"RBAC (Admin, Member, Viewer)",
				"Automated workflow triggers",
				"Real-time notifications",
			],
		}),
		[],
	);

	const uxModule = useMemo<FeatureListModule>(
		() => ({
			moduleLabel: "Module 03",
			title: "UX Layer",
			description:
				"Designed to reduce friction with instantaneous transitions, persistent themes, and modal workflows.",
			metaLabel: "FCP Speed: 0.2s",
			items: [
				"Responsive layout system",
				"Dark/Light system sync",
				"Side-drawer management",
				"Structural deep links",
			],
		}),
		[],
	);

	const roadmapModule = useMemo<FeatureListModule>(
		() => ({
			moduleLabel: "Module 04",
			title: "Advanced Engine Roadmap",
			description:
				"Future architectural enhancements focusing on WebSockets, hotkey execution, and optimistic UI.",
			metaLabel: "Target: Q4 2026",
			items: [
				"WebSocket multi-sync",
				"Optimistic UI rendering",
				"Power-user hotkeys",
				"E2E test suite",
			],
		}),
		[],
	);

	return {
		systemHealth,
		coreModule,
		teamModule,
		uxModule,
		roadmapModule,
	};
}
