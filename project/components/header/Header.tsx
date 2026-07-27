"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  const navLinkClass = "text-sm text-slate-300 font-medium transition-colors hover:text-cyan-400";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Brand Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5 group py-1">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                <Image
                  src="/icon.png"
                  alt="Projectnify"
                  width={104}
                  height={104}
                  className="relative h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14"
                  priority
                />
              </div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Projectnify
                </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden space-x-8 md:flex items-center">
            <Link href="#features" className={navLinkClass}>
              Features
            </Link>
            <Link href="#pricing" className={navLinkClass}>
              Pricing
            </Link>
            <Link href="#about" className={navLinkClass}>
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95"
            >
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}