import { Skeleton } from "@/components/skeletons/skeleton";

export function TableListSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="w-full space-y-4">
			{/* Table Header */}
			<div className="flex items-center justify-between border-b pb-4">
				<div className="flex items-center space-x-4 w-full">
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-4 w-1/4 hidden md:block" />
				</div>
			</div>

			{/* Table Rows */}
			<div className="space-y-4">
				{Array.from({ length: rows }).map((_, i) => (
					<div
						/* biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static */
						key={i}
						className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
					>
						<div className="flex items-center space-x-4 w-full">
							<div className="w-1/4 flex items-center space-x-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-32" />
								</div>
							</div>
							<Skeleton className="h-4 w-1/4" />
							<Skeleton className="h-4 w-1/4" />
							<div className="w-1/4 hidden md:flex items-center space-x-2">
								<Skeleton className="h-8 w-8 rounded-md" />
								<Skeleton className="h-8 w-8 rounded-md" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
