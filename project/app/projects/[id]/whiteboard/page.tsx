"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useWhiteBoard } from "@/hooks/project/(tabs)/useWhiteBoard";

export default function WhiteBoard() {
	const { persistenceKey } = useWhiteBoard();

	return (
		<div className="space-y-4 pb-12">
			{/* Header Info */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
						Project Collaborative Whiteboard
					</h2>
					<p className="text-sm text-outer_space-500 dark:text-platinum-400">
						Brainstorm system architectures, draw wireframes, and map user flows
						on an infinite workspace canvas.
					</p>
				</div>
			</div>

			{/* Whiteboard Container */}
			<div className="relative z-10 h-[700px] w-full overflow-hidden rounded-2xl border border-french_gray-200 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:ring-white/10">
				<div className="absolute inset-0">
					<Tldraw persistenceKey={persistenceKey} />
				</div>
			</div>
		</div>
	);
}
