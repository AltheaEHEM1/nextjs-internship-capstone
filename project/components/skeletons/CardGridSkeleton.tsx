import { Skeleton } from "@/components/skeletons/skeleton";

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<div
					/* biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static */
					key={i}
					className="flex flex-col space-y-3 p-6 border rounded-xl bg-card"
				>
					<div className="flex items-center justify-between">
						<Skeleton className="h-6 w-1/2" />
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
					<div className="pt-4 flex items-center justify-between">
						<Skeleton className="h-5 w-16" />
						<div className="flex -space-x-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-8 w-8 rounded-full" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
