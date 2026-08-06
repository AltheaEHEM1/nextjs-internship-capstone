// Public page Zustand store

import {
	Compass,
	type LucideIcon,
	ShieldAlert,
	Target,
	Zap,
} from "lucide-react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types for About page
export interface AboutFeature {
	id: string;
	title: string;
	quote: string;
	tag: string;
	icon: LucideIcon;
	gradient: string;
	accentBg: string;
	glowColor: string;
}

export interface PublicPageState {
	// About page state
	aboutFeatures: AboutFeature[];
	aboutActiveTab: number;
	setAboutActiveTab: (tab: number) => void;
	// Features page placeholder
	featuresData: any | null;
	setFeaturesData: (data: any) => void;
	// Pricing page placeholder
	pricingData: any | null;
	setPricingData: (data: any) => void;
}

export const usePublicPageStore = create<PublicPageState>()(
	devtools((set, get) => ({
		// About page static data
		aboutFeatures: [
			{
				id: "story",
				title: "Brand Story",
				quote:
					"Projectnify is built for modern teams who want a clean, collaborative workspace...",
				tag: "Origins",
				icon: Compass,
				gradient: "from-teal-500 via-cyan-500 to-blue-500",
				accentBg: "bg-cyan-50 border-cyan-200 text-cyan-600",
				glowColor: "bg-cyan-400/20",
			},
			{
				id: "mission",
				title: "Our Mission",
				quote:
					"Make project management effortless with powerful visual tools, intuitive workflows, and real-time collaboration.",
				tag: "Purpose",
				icon: Target,
				gradient: "from-blue-600 via-indigo-500 to-purple-500",
				accentBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
				glowColor: "bg-indigo-400/20",
			},
			{
				id: "problems",
				title: "Problems We Solve",
				quote:
					"Eliminate scattered tasks, unclear priorities, and friction-filled team communication.",
				tag: "Solution",
				icon: ShieldAlert,
				gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
				accentBg: "bg-purple-50 border-purple-200 text-purple-600",
				glowColor: "bg-purple-400/20",
			},
			{
				id: "value",
				title: "Our Value",
				quote:
					"Fast setup, flexible boards, and a polished interface that makes work feel truly effortless.",
				tag: "Advantage",
				icon: Zap,
				gradient: "from-emerald-500 via-teal-500 to-cyan-500",
				accentBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
				glowColor: "bg-emerald-400/20",
			},
		],
		aboutActiveTab: 0,
		setAboutActiveTab: (tab) => set({ aboutActiveTab: tab }),
		// Placeholder fields for future pages
		featuresData: null,
		setFeaturesData: (data) => set({ featuresData: data }),
		pricingData: null,
		setPricingData: (data) => set({ pricingData: data }),
	})),
);
