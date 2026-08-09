import type { ReactNode } from "react";
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
	return (
		<BaseProject params={resolvedParams}>
			<div className="py-3">{children}</div>
		</BaseProject>
	);
}
