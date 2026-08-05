"use client";

import { usePathname } from "next/navigation";

/** Segment prefixes that map to each layout. */
const AUTH_PREFIXES = ["/login", "/register", "/forgot-password"];
const ADMIN_PREFIXES = [
	"/dashboard",
	"/projects",
	"/project",
	"/team",
	"/task",
	"/settings",
];

/** Routes where the admin <main> padding should be suppressed. */
const NO_PADDING_PREFIXES = ["/project/"];

/**
 * Determines which layout shell to render based on the current pathname.
 */
export function useLayoutWrapper() {
	const pathname = usePathname();

	const isAuthPath = AUTH_PREFIXES.some((p) => pathname.startsWith(p));
	const isAdminPath = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
	const disableAdminPadding = NO_PADDING_PREFIXES.some((p) =>
		pathname.startsWith(p),
	);

	return { isAdminPath, isAuthPath, disableAdminPadding };
}
