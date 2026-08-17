"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

export function InvitationLoadingState() {
	return (
		<div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-outer_space-700 dark:via-outer_space-600 dark:to-outer_space-800 p-4 overflow-hidden">
			{/* Ambient background glows */}
			<div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue_munsell-500/15 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

			<div className="relative w-full max-w-md rounded-3xl bg-white/85 dark:bg-outer_space-500/85 backdrop-blur-xl p-8 sm:p-10 shadow-2xl border border-gray-200/70 dark:border-paynes_gray-600/70 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
				<div className="relative mx-auto flex h-20 w-20 items-center justify-center">
					<div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue_munsell-500/30 blur-md animate-pulse" />
					<Image
						src="/icon.png"
						alt="Projectnify Logo"
						width={64}
						height={64}
						priority
						className="relative h-16 w-16 object-contain"
					/>
				</div>

				<div className="space-y-2">
					<h2 className="text-xl font-bold text-gray-900 dark:text-platinum-100 tracking-tight">
						Verifying Invitation
					</h2>
					<p className="text-xs sm:text-sm text-gray-500 dark:text-platinum-300">
						Please wait while we validate your invitation link...
					</p>
				</div>

				<div className="flex items-center justify-center pt-2">
					<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue_munsell-50 dark:bg-blue_munsell-900/30 border border-blue_munsell-200 dark:border-blue_munsell-700/50 text-blue_munsell-600 dark:text-blue_munsell-200 text-xs font-medium">
						<Loader2 className="animate-spin" size={16} />
						<span>Connecting to Projectnify</span>
					</div>
				</div>
			</div>
		</div>
	);
}
