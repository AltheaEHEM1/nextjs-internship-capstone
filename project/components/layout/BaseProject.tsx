import type { ReactNode } from "react";
import ProjectHeader from "@/components/project-component/ProjectHeader";
import ProjectNav from "@/components/project-component/ProjectNavigation";

interface BaseProjectProps {
	children: ReactNode;
	params: { id: string };
}

export default function BaseProject({ children, params }: BaseProjectProps) {
	const { id } = params;

	return (
		<div className="mx-4 my-5 sm:mx-6 lg:mx-8">
			<div className="sticky top-0 z-40 bg-white dark:bg-outer_space-950/90 dark:shadow-black/20">
				<div className=" border-french_gray-200 dark:border-payne's_gray-700">
					<ProjectHeader title="Website Redesign" projectId={id} />
				</div>
				<ProjectNav />
			</div>
			{children}
		</div>
	);
}
