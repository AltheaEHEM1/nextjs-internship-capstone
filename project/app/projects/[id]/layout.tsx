import type { ReactNode } from "react";
import BaseProject from "@/components/layout/BaseProject";
import { getProjectDetailAction } from "@/actions/project/Project";

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
	const projectDetails = projectRes.success ? projectRes.data : null;

	return (
		<BaseProject params={resolvedParams} projectDetails={projectDetails}>
			<div className="py-3">{children}</div>
		</BaseProject>
	);
}
