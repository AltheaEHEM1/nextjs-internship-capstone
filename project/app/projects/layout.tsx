import type React from "react";
import { auth } from "@clerk/nextjs/server";
export default async function ProjectsLayout({ children }: { children: React.ReactNode }) {
    await auth.protect();
    return <>{children}</>;
}
