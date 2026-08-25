// modified

"use client";
import type React from "react";
import { GlobalNotificationListener } from "@/components/notification/GlobalNotificationListener";
import { useLayoutWrapper } from "@/hooks/layout/useLayoutWrapper";
import BaseAdmin from "./BaseAdmin";
import BaseAuth from "./BaseAuth";
import BasePublic from "./BasePublic";

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAdminPath, isAuthPath, isStandalonePath, disableAdminPadding } =
		useLayoutWrapper();

	if (isStandalonePath) {
		return <>{children}</>;
	}

	if (isAuthPath) {
		return (
			<>
				<GlobalNotificationListener />
				<BaseAuth>{children}</BaseAuth>
			</>
		);
	}

	if (isAdminPath) {
		return (
			<>
				<GlobalNotificationListener />
				<BaseAdmin disableMainPadding={disableAdminPadding}>
					{children}
				</BaseAdmin>
			</>
		);
	}

	return (
		<>
			<GlobalNotificationListener />
			<BasePublic>{children}</BasePublic>
		</>
	);
}
