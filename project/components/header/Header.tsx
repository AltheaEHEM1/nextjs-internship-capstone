"use client";

import Link from "next/link";

export function Header() {
 
  return (
    <header className="border-b border-french_gray-300 bg-white/80 backdrop-blur-sm dark:border-payne's_gray-400 dark:bg-outer_space-500/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue_munsell-500">
              Projectnify
            </Link>
          </div>

          <nav className="hidden space-x-8 md:flex">
            <Link
              href="#features"
              className="text-outer_space-500 transition-colors hover:text-blue_munsell-500 dark:text-platinum-500"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-outer_space-500 transition-colors hover:text-blue_munsell-500 dark:text-platinum-500"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-outer_space-500 transition-colors hover:text-blue_munsell-500 dark:text-platinum-500"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/sign-in"
              className="text-outer_space-500 hover:text-blue_munsell-500 dark:text-platinum-500"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-white transition-colors hover:bg-blue_munsell-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
