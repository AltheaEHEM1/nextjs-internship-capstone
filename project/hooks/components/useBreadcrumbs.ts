"use client";

import { usePathname } from "next/navigation";

function formatSegment(segment: string) {
	if (/^\d+$/.test(segment)) return "Details";

	return segment
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function useBreadcrumbs() {
	const pathname = usePathname();
	const segments = pathname?.split("/").filter(Boolean) ?? [];
	const items = segments.filter((segment) => segment !== "dashboard");

	const breadcrumbs = items.map((segment, index) => {
		const originalIndex = segments.indexOf(segment);
		const href = `/${segments.slice(0, originalIndex + 1).join("/")}`;
		const isCurrent = index === items.length - 1;

		return {
			segment,
			label: formatSegment(segment),
			href,
			isCurrent,
		};
	});

	return { breadcrumbs };
}
