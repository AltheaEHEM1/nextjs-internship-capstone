"use client";

import Image from "next/image";
import Link from "next/link";
import { useHeader } from "../../hooks/header/useHeader";

export function Header() {
	const { isOpen, setIsOpen, toggle, close, navLinks, pathname, isActive } =
		useHeader();
	const navLinkClass =
		"text-sm text-slate-300 font-medium transition-colors hover:text-cyan-400";

	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
			<div className="container mx-auto px-3 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-2">
					{/* Logo & Brand Section */}
					<div className="flex items-center min-w-0">
						<Link
							href="/"
							className="group flex items-center gap-1.5 py-1 min-w-0"
						>
							<div className="relative flex items-center justify-center shrink-0">
								<div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
								<Image
									src="/icon.png"
									alt="Projectnify"
									width={104}
									height={104}
									className="relative h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
									priority
								/>
							</div>
							<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-lg sm:text-xl font-extrabold tracking-tight text-transparent truncate dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
								Projectnify
							</span>
						</Link>
					</div>

					{/* Navigation Links */}
					<nav className="hidden items-center space-x-4 lg:space-x-8 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={
									navLinkClass +
									(isActive(link.href) ? " text-white font-semibold" : "")
								}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Action Buttons */}
					<div className="hidden items-center space-x-3 lg:space-x-4 md:flex shrink-0">
						<Link
							href="/sign-in"
							className="px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
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

					<button
						type="button"
						className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:bg-slate-800 md:hidden shrink-0"
						aria-expanded={isOpen}
						aria-label="Toggle navigation menu"
						onClick={toggle}
					>
						<span className="sr-only">Toggle navigation</span>
						<span className="flex h-5 w-5 flex-col justify-between">
							<span
								className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
									isOpen ? "translate-y-1.5 rotate-45" : ""
								}`}
							/>
							<span
								className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300 ${
									isOpen ? "opacity-0" : ""
								}`}
							/>
							<span
								className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
									isOpen ? "-translate-y-1.5 -rotate-45" : ""
								}`}
							/>
						</span>
					</button>
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
					<div className="space-y-3 px-4 py-4">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className={
									"block rounded-xl px-4 py-3 text-sm font-medium transition-colors " +
									(isActive(link.href)
										? "bg-slate-800 text-white"
										: "text-slate-300 hover:bg-slate-900 hover:text-white")
								}
							>
								{link.label}
							</Link>
						))}

						<div className="space-y-2 pt-2 border-t border-slate-800/60">
							<Link
								href="/sign-in"
								onClick={close}
								className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
							>
								Sign In
							</Link>
							<Link
								href="/sign-up"
								onClick={close}
								className="block rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:brightness-110"
							>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
