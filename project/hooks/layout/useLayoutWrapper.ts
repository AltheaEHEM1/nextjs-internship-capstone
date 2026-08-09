"use client";

import { usePathname } from "next/navigation";

/** Segment prefixes that map to each layout. */
const AUTH_PREFIXES = ["/login", "/register", "/forgot-password"];
const ADMIN_PREFIXES = [
	"/dashboard",
	"/projects", // for navigation
	"/project", // this is for the main page of the project
	"/notification",
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
	
	// Disable padding for /projects/[id] but keep it for /projects
	let disableAdminPadding = NO_PADDING_PREFIXES.some((p) =>
		pathname.startsWith(p),
	);
	if (pathname.startsWith("/projects/") && pathname !== "/projects") {
		disableAdminPadding = true;
	}

	return { isAdminPath, isAuthPath, disableAdminPadding };
}
