"use client";

import { AlertCircle, ArrowRight, Home, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface InvitationErrorStateProps {
	message: string;
}

export function InvitationErrorState({ message }: InvitationErrorStateProps) {
	return (
		<div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-outer_space-700 dark:via-outer_space-600 dark:to-outer_space-800 p-4 overflow-hidden">
			{/* Ambient background glows */}
			<div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue_munsell-500/10 blur-3xl pointer-events-none" />

			<div className="relative w-full max-w-md rounded-3xl bg-white/85 dark:bg-outer_space-500/85 backdrop-blur-xl p-8 sm:p-10 shadow-2xl border border-gray-200/70 dark:border-paynes_gray-600/70 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
				{/* Top Logo */}
				<div className="flex justify-center items-center gap-2">
					<Image
						src="/icon.png"
						alt="Projectnify Logo"
						width={36}
						height={36}
						priority
						className="h-9 w-9 object-contain"
					/>
					<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
						Projectnify
					</span>
				</div>

				{/* Error Icon */}
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/15 text-rose-500 ring-8 ring-rose-50/50 dark:ring-rose-500/10 shadow-inner">
					<AlertCircle size={32} />
				</div>

				{/* Error Message */}
				<div className="space-y-2">
					<h2 className="text-xl font-bold text-gray-900 dark:text-platinum-100 tracking-tight">
						Unable to Accept Invitation
					</h2>
					<p className="text-sm text-gray-500 dark:text-platinum-300 leading-relaxed">
						{message ||
							"This invitation link is invalid, expired, or has already been used."}
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 pt-2">
					<Link
						href="/"
						className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-paynes_gray-600 py-2.5 px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-platinum-200 hover:bg-gray-100 dark:hover:bg-outer_space-400 transition active:scale-[0.98]"
					>
						<Home size={16} />
						<span>Home</span>
					</Link>
					<Link
						href="/team"
						className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue_munsell-500 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-blue_munsell-600 transition shadow-lg shadow-blue_munsell-500/25 active:scale-[0.98]"
					>
						<Users size={16} />
						<span>View Teams</span>
						<ArrowRight size={14} />
					</Link>
				</div>
			</div>
		</div>
	);
}
