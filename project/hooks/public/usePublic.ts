import { useRef } from "react";
import { usePublicStore } from "@/stores/public/PublicStore";

export function useAboutTab() {
	const activeTab = usePublicStore((state) => state.aboutActiveTab);
	const setActiveTab = usePublicStore((state) => state.setAboutActiveTab);

	return {
		activeTab,
		setActiveTab,
	};
}

export function usePricingSpotlight() {
	const mousePosition = usePublicStore((state) => state.mousePosition);
	const setMousePosition = usePublicStore((state) => state.setMousePosition);
	const containerRef = useRef<HTMLDivElement>(null);

	// Dynamic light tracking based on mouse movement
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return {
		mousePosition,
		containerRef,
		handleMouseMove,
	};
}
