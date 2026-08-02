// modified

"use client";
import { usePathname } from "next/navigation";
import type React from "react";
import BaseAdmin from "./BaseAdmin";
import BaseAuth from "./BaseAuth";
import BasePublic from "./BasePublic";

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const adminPaths = [
		"/dashboard",
		"/projects",
		"/team",
		"/analytics",
		"/calendar",
		"/notification",
	];
	const authPaths = ["/sign-in", "/sign-up"];

	const isAdminPath = adminPaths.some((path) => pathname?.startsWith(path));
	const isAuthPath = authPaths.some((path) => pathname?.startsWith(path));

	const disableAdminPadding =
		!!pathname &&
		pathname.startsWith("/projects/") &&
		pathname !== "/projects" &&
		!pathname.startsWith("/projects/project-settings");

	if (isAuthPath) {
		return <BaseAuth>{children}</BaseAuth>;
	}

	if (isAdminPath) {
		return (
			<BaseAdmin disableMainPadding={disableAdminPadding}>{children}</BaseAdmin>
		);
	}

	return <BasePublic>{children}</BasePublic>;
}
