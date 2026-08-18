import type { ReactNode } from "react";
import { getProjectDetailAction } from "@/actions/project/Project";
import BaseProject from "@/components/layout/BaseProject";

interface ProjectLayoutProps {
	children: ReactNode;
	params: Promise<{ id: string }>;
}

export default async function ProjectLayout({
	children,
	params,
}: ProjectLayoutProps) {
	const resolvedParams = await params;
	const projectRes = await getProjectDetailAction(resolvedParams.id);
	const projectDetails = projectRes.success ? projectRes.data : undefined;

	return (
		<BaseProject params={resolvedParams} projectDetails={projectDetails}>
			<div className="py-3">{children}</div>
		</BaseProject>
	);
}
