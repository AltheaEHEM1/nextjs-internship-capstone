//modified

import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
// TODO: Task 2.1 - Set up Clerk authentication service
// import { ClerkProvider } from "@clerk/nextjs"
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
  description: "A Project Management Tool forTeam collaboration and project management platform",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TODO: Task 2.1 - Wrap with ClerkProvider once Clerk is set up
    // <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable}`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
    // </ClerkProvider>
  );
}
