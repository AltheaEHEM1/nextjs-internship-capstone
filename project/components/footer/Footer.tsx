"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrentYear } from "../../hooks/modal/useCurrentYear";

export function Footer() {
	const year = useCurrentYear();

	return (
		<footer className="border-t border-slate-800/60 bg-slate-950 py-8 text-slate-300">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 items-center gap-6 md:grid-cols-5">
					{/* Brand Column */}
					<div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left md:col-span-2 md:items-center">
						<Link href="/" className="flex flex-shrink-0 items-center">
							<Image
								src="/icon.png"
								alt="Projectnify"
								width={104}
								height={104}
								className="h-12 w-auto object-contain sm:h-16"
								priority
							/>
						</Link>
						<div className="flex flex-col justify-center">
							<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
								Projectnify
							</span>
							<p className="mt-1 text-xs text-slate-400 max-w-xs">
								Modern project management for high-performing teams.
							</p>
						</div>
					</div>

					{/* Quick Links Group */}
					<div className="grid grid-cols-3 gap-3 sm:gap-6 text-left sm:text-left md:text-right text-xs sm:text-sm md:col-span-3">
						<div>
							<h4 className="mb-2 font-semibold text-white">Product</h4>
							<ul className="space-y-1.5">
								<li>
									<Link
										href="/Features"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="/Pricing"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Pricing
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Security
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-white">Company</h4>
							<ul className="space-y-1.5">
								<li>
									<Link
										href="/About"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Careers
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-white">Support</h4>
							<ul className="space-y-1.5">
								<li>
									<Link
										href="#"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Help
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-slate-400 transition-colors hover:text-cyan-400"
									>
										API
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 flex flex-col items-center justify-between border-t border-slate-900 pt-4 text-xs text-slate-500 gap-2 sm:flex-row sm:mt-6 sm:gap-0">
					<p>© {year} Projectnify. All rights reserved.</p>
					<div className="flex space-x-4">
						<Link href="#" className="transition-colors hover:text-cyan-400">
							Privacy
						</Link>
						<Link href="#" className="transition-colors hover:text-cyan-400">
							Terms
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
