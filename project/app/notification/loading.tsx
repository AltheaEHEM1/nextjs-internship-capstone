import { TableListSkeleton } from "@/components/skeletons/TableListSkeleton";

export default function Loading() {
	return (
		<div className="max-w-4xl space-y-6">
			<div className="flex items-start justify-between">
				<div className="space-y-2 mb-8">
					<div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
					<div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
				</div>
			</div>
			<TableListSkeleton rows={5} />
		</div>
	);
}
