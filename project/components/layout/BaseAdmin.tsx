"use client";
import type React from "react";
import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../sidebar/SidebarHeader";

export default function BaseAdmin({
	children,
	disableMainPadding = false,
}: Readonly<{ children: React.ReactNode; disableMainPadding?: boolean }>) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar opened={sidebarOpen} close={() => setSidebarOpen(false)} />

			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<Header onMenuClick={() => setSidebarOpen(true)} />
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
