"use client";

import { Skeleton } from "@/components/skeletons/skeleton";

export function InvitationLoadingState() {
	return (
		<div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-outer_space-700 dark:via-outer_space-600 dark:to-outer_space-800 p-4 overflow-hidden">
			{/* Ambient background glows */}
			<div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue_munsell-500/15 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

			<div className="relative w-full max-w-lg rounded-3xl bg-white/90 dark:bg-outer_space-500/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl border border-gray-200/80 dark:border-paynes_gray-600/80 space-y-6">
				{/* Top Branding Bar */}
				<div className="flex items-center justify-between border-b border-gray-100 dark:border-paynes_gray-600/60 pb-4">
					<div className="flex items-center gap-2.5">
						<Skeleton className="h-8 w-8 rounded-md" />
						<Skeleton className="h-6 w-24" />
					</div>
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>

				{/* Header Section */}
				<div className="space-y-4 pt-2">
					<div className="flex items-center gap-4">
						<Skeleton className="h-14 w-14 rounded-2xl" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-6 w-48" />
						</div>
					</div>

					<div className="rounded-xl bg-gray-50/50 dark:bg-paynes_gray-600/20 p-4 border border-gray-100 dark:border-paynes_gray-600/50">
						<div className="flex items-start gap-3">
							<Skeleton className="h-10 w-10 rounded-full shrink-0" />
							<div className="space-y-2 flex-1 pt-1">
								<Skeleton className="h-4 w-40" />
								<Skeleton className="h-3 w-64" />
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-100 dark:border-paynes_gray-600/60 pt-6 space-y-3">
					<Skeleton className="h-12 w-full rounded-xl" />
					<Skeleton className="h-12 w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}
