// hooks/public/useAbout.ts
"use client";

import type { AboutFeature } from "@/stores/public-page-store";
import { usePublicPageStore } from "@/stores/public-page-store";

/**
 * Custom hook for the About page.
 * Provides feature list, active tab handling, and the currently active feature.
 */
export function useAbout() {
	const aboutFeatures = usePublicPageStore((state) => state.aboutFeatures);
	const activeTab = usePublicPageStore((state) => state.aboutActiveTab);
	const setActiveTab = usePublicPageStore((state) => state.setAboutActiveTab);

	const activeFeature = aboutFeatures[activeTab] ?? aboutFeatures[0];
	const ActiveIcon = activeFeature?.icon;

	// Expose a simplified features array for the component
	const features = aboutFeatures.map((f) => ({
		id: f.id,
		title: f.title,
		icon: f.icon,
		tag: f.tag,
		gradient: f.gradient,
		accentBg: f.accentBg,
		glowColor: f.glowColor,
	}));

	return {
		features,
		activeTab,
		setActiveTab,
		activeFeature,
		ActiveIcon,
	} as const;
}
