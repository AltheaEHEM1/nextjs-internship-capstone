import { useEffect, useRef } from "react";
import { usePublicStore } from "@/stores/public/PublicStore";

export function useAboutTab(featuresLength: number) {
	const activeTab = usePublicStore((state) => state.aboutActiveTab);
	const setActiveTab = usePublicStore((state) => state.setAboutActiveTab);

	// Auto-rotate tabs every 6 seconds
	useEffect(() => {
		const timer = setInterval(() => {
			setActiveTab((prev) => (prev + 1) % featuresLength);
		}, 6000);
		return () => clearInterval(timer);
	}, [featuresLength, setActiveTab]);

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
