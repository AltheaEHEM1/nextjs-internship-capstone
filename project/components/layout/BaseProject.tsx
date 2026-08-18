"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ProjectHeader from "@/components/project-component/ProjectHeader";
import ProjectNav from "@/components/project-component/ProjectNavigation";

interface BaseProjectProps {
	children: ReactNode;
	params: { id: string };
	projectDetails?: { name?: string | null; views?: unknown } | null;
}

export default function BaseProject({
	children,
	params,
	projectDetails,
}: BaseProjectProps) {
	const { id } = params;
	const pathname = usePathname();
	const isProjectSettings = pathname?.includes("/project-settings");

	return (
		<div className="flex h-full flex-col">
			{!isProjectSettings && (
				<div className="sticky top-0 z-40 bg-white px-4 pt-5 sm:px-6 lg:px-8 dark:bg-outer_space-950/90 dark:shadow-black/20">
					<div className="border-french_gray-200 dark:border-payne's_gray-700">
						<ProjectHeader
							title={projectDetails?.name || "Loading Project..."}
							projectId={id}
						/>
					</div>
					<ProjectNav
						projectId={id}
						projectViews={(projectDetails?.views as string[]) ?? undefined}
					/>
				</div>
			)}
			<div className="flex-1 px-4 pb-5 sm:px-6 lg:px-8">{children}</div>
		</div>
	);
}
