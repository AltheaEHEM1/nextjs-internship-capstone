"use client";
import type React from "react";
import { Suspense } from "react";
import { useBaseAdmin } from "../../hooks/layout/useBaseAdmin";
import Sidebar from "../sidebar/Sidebar";
import Header from "../sidebar/SidebarHeader";

export default function BaseAdmin({
	children,
	disableMainPadding = false,
}: Readonly<{ children: React.ReactNode; disableMainPadding?: boolean }>) {
	const { sidebarOpen, open, close } = useBaseAdmin(false);

	return (
		<div className="flex h-screen overflow-hidden">
			<Suspense fallback={null}>
				<Sidebar opened={sidebarOpen} close={close} />
			</Suspense>

			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<Header onMenuClick={open} />
				<main
					className={
						"flex min-h-0 flex-1 flex-col overflow-y-auto" +
						(disableMainPadding ? "" : " px-4 py-8 sm:px-6 lg:px-8")
					}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
