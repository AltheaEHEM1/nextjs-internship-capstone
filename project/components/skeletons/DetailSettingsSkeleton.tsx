import { Skeleton } from "@/components/skeletons/skeleton";

export function DetailSettingsSkeleton() {
	return (
		<div className="max-w-4xl mx-auto space-y-8 p-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b pb-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-10 w-24 rounded-md" />
			</div>

			{/* Form / Content Sections */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-1 space-y-2">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-full" />
				</div>
				<div className="md:col-span-2 space-y-6 bg-card p-6 border rounded-xl">
					<div className="space-y-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-10 w-full rounded-md" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-32 w-full rounded-md" />
					</div>
					<div className="flex justify-end pt-4">
						<Skeleton className="h-10 w-28 rounded-md" />
					</div>
				</div>
			</div>

			{/* Secondary Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-1 space-y-2">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-full" />
				</div>
				<div className="md:col-span-2 space-y-6 bg-card p-6 border rounded-xl">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-64" />
						</div>
						<Skeleton className="h-6 w-12 rounded-full" />
					</div>
				</div>
			</div>
		</div>
	);
}
