import { Skeleton } from "@/components/skeletons/skeleton";

interface KanbanBoardSkeletonProps {
	columnsCount?: number;
}

export function KanbanBoardSkeleton({
	columnsCount = 3,
}: KanbanBoardSkeletonProps) {
	// Varied realistic card counts per column
	const cardsPerColumn = [3, 2, 2, 1];

	return (
		<div className="flex gap-6 overflow-x-auto px-4 py-6">
			{Array.from({ length: columnsCount }).map((_, colIndex) => {
				const cardCount = cardsPerColumn[colIndex % cardsPerColumn.length] || 2;
				return (
					<div
						/* biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static */
						key={colIndex}
						className="flex max-h-[calc(100vh-100px)] w-72 flex-shrink-0 flex-col rounded-xl border border-french_gray-200 bg-platinum-100 sm:w-80 dark:border-payne's_gray-600 dark:bg-outer_space-500"
					>
						{/* Column Header */}
						<div className="flex items-center justify-between border-b border-french_gray-200 p-4 dark:border-payne's_gray-600">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-24 rounded-md" />
								<Skeleton className="h-5 w-6 rounded-full" />
							</div>
						</div>

						{/* Task Cards Container */}
						<div className="min-h-[350px] flex-1 space-y-3 p-4">
							{Array.from({ length: cardCount }).map((_, cardIndex) => (
								<div
									/* biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static */
									key={cardIndex}
									className="flex flex-col rounded-lg border border-french_gray-200 bg-white p-4 shadow-xs space-y-2.5 dark:border-payne's_gray-600 dark:bg-outer_space-400"
								>
									<Skeleton
										className={`h-4 rounded ${cardIndex % 2 === 0 ? "w-3/4" : "w-2/3"}`}
									/>
									<div className="space-y-1.5">
										<Skeleton className="h-3 w-full rounded" />
										<Skeleton className="h-3 w-4/5 rounded" />
									</div>
									<div className="flex items-center justify-between pt-2">
										<Skeleton className="h-4 w-12 rounded-md" />
										<Skeleton className="h-6 w-6 rounded-full" />
									</div>
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
