"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useBreadcrumbStore } from "@/stores/components/breadcrumb-store";

export interface Breadcrumb {
	href: string;
	label: string;
	isCurrent: boolean;
}

/**
 * Derives breadcrumb entries from the current pathname.
 * Each path segment is title-cased and linked.
 * The last segment is marked as `isCurrent`.
 */
export function useBreadcrumbs(): { breadcrumbs: Breadcrumb[] } {
	const pathname = usePathname();
	const mappings = useBreadcrumbStore((s) => s.mappings);

	const breadcrumbs = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);

		const isDashboard = segments[0] === "dashboard";
		const filtered = isDashboard ? segments.slice(1) : segments;

		const rawBreadcrumbs = filtered.map((segment, index) => {
			const actualIndex = isDashboard ? index + 1 : index;
			const href = `/${segments.slice(0, actualIndex + 1).join("/")}`;

			let label = mappings[segment];

			if (!label) {
				const isUUID =
					/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
						segment,
					);
				if (isUUID) {
					label = "Detail"; // Fallback until data loads and sets mapping
				} else {
					label = decodeURIComponent(segment)
						.replace(/[-_]/g, " ")
						.replace(/\b\w/g, (c) => c.toUpperCase());
				}
			}

			return { href, label, isCurrent: false };
		});

		const finalBreadcrumbs = rawBreadcrumbs.filter(
			(bc, i, arr) => i === 0 || arr[i - 1].label !== bc.label,
		);

		if (finalBreadcrumbs.length > 0) {
			finalBreadcrumbs[finalBreadcrumbs.length - 1].isCurrent = true;
		}

		return finalBreadcrumbs;
	}, [pathname, mappings]);

	return { breadcrumbs };
}
