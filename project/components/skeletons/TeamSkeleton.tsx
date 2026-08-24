import { Skeleton } from "@/components/skeletons/skeleton";

export function TeamMemberSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
					key={i}
					className="flex items-center justify-between rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500"
				>
					<div className="flex min-w-0 items-center gap-4 w-full">
						<Skeleton className="h-11 w-11 shrink-0 rounded-full" />
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-3 w-40" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function TeamCardSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
					key={i}
					className="flex items-center justify-between rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500"
				>
					<div className="flex items-center gap-3 w-full">
						<Skeleton className="h-10 w-10 shrink-0 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function TeamPageSkeleton() {
	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-80 max-w-full" />
				</div>
				<Skeleton className="h-10 w-32 rounded-xl" />
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<Skeleton className="h-10 w-[180px] rounded-lg" />
				<Skeleton className="h-10 w-64 rounded-lg ml-auto" />
			</div>

			<TeamMemberSkeleton count={6} />
		</div>
	);
}
