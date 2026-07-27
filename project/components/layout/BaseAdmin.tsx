// modified

"use client";
import type React from "react";
import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../sidebar/SidebarHeader";

export default function BaseAdmin({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar opened={sidebarOpen} close={() => setSidebarOpen(false)} />

			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<Header onMenuClick={() => setSidebarOpen(true)} />

				<main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-20 py-12">
					{children}
				</main>
			</div>
		</div>
	);
}

