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

		// Skip the first segment if it's "dashboard" (already shown as a static link)
		const filtered = segments[0] === "dashboard" ? segments.slice(1) : segments;

		return filtered.map((segment, index) => {
			const href = `/${segments.slice(0, segments.indexOf(segment) + 1).join("/")}`;

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

			const isCurrent = index === filtered.length - 1;

			return { href, label, isCurrent };
		});
	}, [pathname, mappings]);

	return { breadcrumbs };
}
