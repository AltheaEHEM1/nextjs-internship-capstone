import { auth } from "@clerk/nextjs/server";
import type React from "react";
export default async function ProjectsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await auth.protect();
	return <>{children}</>;
}
