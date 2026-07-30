import type { ReactNode } from "react";

export interface PageHeaderProps {
	title: string;
	description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<header className="mb-6 space-y-0">
			<h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
				{title}
			</h1>
			<p className="mt-2 text-payne's_gray-500 dark:text-french_gray-500">
				{description}
			</p>
		</header>
	);
}
