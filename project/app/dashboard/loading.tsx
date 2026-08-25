import { DetailSettingsSkeleton } from "@/components/skeletons/DetailSettingsSkeleton";

export default function Loading() {
	return (
		<div className="p-6 md:p-10 space-y-6">
			<div className="space-y-2 mb-8">
				<div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
				<div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
			</div>
			<DetailSettingsSkeleton />
		</div>
	);
}
