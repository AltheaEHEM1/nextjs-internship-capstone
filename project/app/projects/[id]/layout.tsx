import type { ReactNode } from "react";
import BaseProject from "@/components/layout/BaseProject";

interface ProjectLayoutProps {
	children: ReactNode;
	params: { id: string };
}

export default function ProjectLayout({
	children,
	params,
}: ProjectLayoutProps) {
	return (
		<BaseProject params={params}>
			<div className="py-3">{children}</div>
		</BaseProject>
	);
}
