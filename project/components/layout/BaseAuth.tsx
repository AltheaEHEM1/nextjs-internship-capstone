"use client";
import type React from "react";
import { useState } from "react";

export default function BaseAuth({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-white text-slate-900">
			{/* Rich ambient background glows matching your logo palette with enhanced depth */}
			<div className="pointer-events-none absolute -left-20 -top-32 h-[500px] w-[500px] rounded-full bg-[#14F195]/20 blur-[120px]" />
			<div className="bg-[#00D2FF]/15 pointer-events-none absolute right-[-10%] top-10 h-[600px] w-[600px] rounded-full blur-[140px]" />
			<div className="to-[#7C3AED]/15 pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#2563EB]/10 via-[#3B82F6]/10 blur-[160px]" />
			<div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#4F46E5]/10 blur-[130px]" />

			{/* Subtle mesh overlay grid for modern dashboard feel */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] opacity-40 [background-size:24px_24px]" />

			{/* Content container */}
			<div className="relative z-10 flex flex-1 flex-col">{children}</div>
		</main>
	);
}
