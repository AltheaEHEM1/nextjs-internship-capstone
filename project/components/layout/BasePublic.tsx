import type { ReactNode } from "react";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";

export default function BasePublic({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900">
			<Header />
			<main className="flex flex-1 w-full flex-col overflow-x-hidden">{children}</main>
			<Footer />
		</div>
	);
}
