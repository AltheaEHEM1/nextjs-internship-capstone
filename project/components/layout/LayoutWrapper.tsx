// modified

"use client";
import { usePathname } from "next/navigation";
import type React from "react";

import BaseAdmin from "./BaseAdmin";
import BasePublic from "./BasePublic";

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const adminPaths = ["/dashboard", "/projects", "/team", "/analytics", "/calendar", "/settings"];

	const isAdminPath = adminPaths.some((path) => pathname?.startsWith(path));

	if (pathname?.startsWith("/auth")) {
		return <>{children}</>;
	}

	if (isAdminPath) {
		return <BaseAdmin>{children}</BaseAdmin>;
	}

	return <BasePublic>{children}</BasePublic>;
}
