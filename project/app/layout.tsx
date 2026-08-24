import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "@/components/toast/toaster";

//import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Projectnify",
	description:
		"A Project Management Tool forTeam collaboration and project management platform",
	generator: "v0.dev",
	icons: {
		icon: [{ url: "/icon.png", type: "image/png", sizes: "300x300" }],
		shortcut: "/icon.png",
		apple: "/icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body
					suppressHydrationWarning
					className={`${poppins.className} ${geistSans.variable} ${geistMono.variable}`}
				>
					<LayoutWrapper>{children}</LayoutWrapper>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}
