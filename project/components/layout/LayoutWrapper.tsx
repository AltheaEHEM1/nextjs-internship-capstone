// modified

"use client";
import type React from "react";
import { useLayoutWrapper } from "@/hooks/layout/useLayoutWrapper";
import BaseAdmin from "./BaseAdmin";
import BaseAuth from "./BaseAuth";
import BasePublic from "./BasePublic";

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAdminPath, isAuthPath, disableAdminPadding } = useLayoutWrapper();

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
