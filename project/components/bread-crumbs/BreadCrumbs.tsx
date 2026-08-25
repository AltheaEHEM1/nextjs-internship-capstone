"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useBreadcrumbs } from "../../hooks/components/useBreadcrumbs";

export function Breadcrumbs() {
	const { breadcrumbs } = useBreadcrumbs();

	return (
		<nav aria-label="Breadcrumb" className="hidden items-center md:flex">
			<ol className="flex items-center gap-2 text-sm">
				<li>
					<Link
						href="/dashboard"
						className="font-medium text-blue_munsell-500 hover:text-outer_space-500 dark:text-platinum-500"
					>
						Dashboard
					</Link>
				</li>
				{breadcrumbs.map(({ href, label, isCurrent }) => (
					<li key={href} className="flex items-center gap-2">
						<ChevronRight
							size={16}
							className="text-payne's_gray-500 dark:text-french_gray-400"
							aria-hidden="true"
						/>
						{isCurrent ? (
							<span
								className="font-medium text-payne's_gray-500 dark:text-french_gray-400"
								aria-current="page"
							>
								{label}
							</span>
						) : (
							<Link
								href={href}
								className="font-medium text-outer_space-500 hover:text-blue_munsell-500 dark:text-platinum-500"
							>
								{label}
							</Link>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
