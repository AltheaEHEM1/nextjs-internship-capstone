import {
	CheckCircle2,
	Clock,
	Loader2,
	LogIn,
	Mail,
	Quote,
	ShieldCheck,
	Sparkles,
	User,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import type {
	ActionLoading,
	InvitationData,
} from "@/stores/invitation/InvitationStore";

interface InvitationCardProps {
	invitation: InvitationData;
	actionLoading: ActionLoading;
	isSignedIn?: boolean;
	onResponse: (action: "accept" | "decline") => Promise<void>;
}

export function InvitationCard({
	invitation,
	actionLoading,
	isSignedIn = true,
	onResponse,
}: InvitationCardProps) {
	const teamName = invitation.team?.name || "Projectnify Workspace";
	const teamIcon = invitation.team?.icon || "🚀";
	const inviterName = invitation.invitedBy?.name || "A team administrator";
	const inviterEmail = invitation.invitedBy?.email;
	const inviterAvatar = invitation.invitedBy?.avatar;

	const formattedExpiry = invitation.expiresAt
		? new Date(invitation.expiresAt).toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: null;

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-outer_space-700 dark:via-outer_space-600 dark:to-outer_space-800 p-4 sm:p-6 overflow-hidden">
			{/* Ambient background glow effects */}
			<div className="absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-blue_munsell-500/15 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

			{/* Main Card */}
			<div className="relative w-full max-w-lg rounded-3xl bg-white/90 dark:bg-outer_space-500/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl border border-gray-200/80 dark:border-paynes_gray-600/80 space-y-6 animate-in fade-in zoom-in-95 duration-300">
				{/* Top Branding Bar */}
				<div className="flex items-center justify-between border-b border-gray-100 dark:border-paynes_gray-600/60 pb-4">
					<div className="flex items-center gap-2.5">
						<div className="relative flex items-center justify-center">
							<div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-sm" />
							<Image
								src="/icon.png"
								alt="Projectnify"
								width={36}
								height={36}
								priority
								className="relative h-9 w-auto object-contain"
							/>
						</div>
						<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-lg sm:text-xl font-extrabold tracking-tight text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
							Projectnify
						</span>
					</div>

					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue_munsell-50 dark:bg-blue_munsell-900/30 border border-blue_munsell-200/60 dark:border-blue_munsell-700/50 text-blue_munsell-600 dark:text-blue_munsell-300 text-xs font-semibold tracking-wide">
						<Sparkles size={13} className="text-blue_munsell-500" />
						<span>Team Invite</span>
					</div>
				</div>

				{/* Team & Inviter Hero Banner */}
				<div className="relative rounded-2xl bg-gradient-to-br from-blue_munsell-50/70 via-gray-50/70 to-cyan-50/40 dark:from-outer_space-600/60 dark:via-outer_space-600/40 dark:to-paynes_gray-600/30 border border-blue_munsell-100/60 dark:border-paynes_gray-600/60 p-5 text-center space-y-3">
					{/* Team Icon Avatar */}
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-outer_space-500 text-2xl shadow-lg border border-gray-100 dark:border-paynes_gray-600 transition-transform duration-300 hover:scale-105">
						<span>{teamIcon}</span>
					</div>

					<div className="space-y-1">
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-platinum-100 tracking-tight">
							Join {teamName}
						</h1>
						<p className="text-xs sm:text-sm text-gray-500 dark:text-platinum-300 leading-relaxed">
							You’ve been invited to collaborate, plan, and deliver projects
							together on Projectnify.
						</p>
					</div>

					{/* Inviter Info Pill */}
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-outer_space-500/80 border border-gray-200/60 dark:border-paynes_gray-600 text-xs text-gray-600 dark:text-platinum-200 shadow-sm">
						{inviterAvatar ? (
							<Image
								src={inviterAvatar}
								alt={inviterName}
								width={18}
								height={18}
								className="h-4.5 w-4.5 rounded-full object-cover"
							/>
						) : (
							<User size={14} className="text-blue_munsell-500" />
						)}
						<span>
							Invited by{" "}
							<strong className="font-semibold text-gray-800 dark:text-platinum-100">
								{inviterName}
							</strong>
							{inviterEmail && (
								<span className="opacity-70"> ({inviterEmail})</span>
							)}
						</span>
					</div>
				</div>

				{/* Recipient Details & Expiry */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					<div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50/80 dark:bg-outer_space-600/40 border border-gray-100 dark:border-paynes_gray-600 text-gray-600 dark:text-platinum-300">
						<Mail size={16} className="text-blue_munsell-500 shrink-0" />
						<div className="min-w-0 flex-1">
							<span className="block text-[10px] uppercase font-semibold text-gray-400 dark:text-platinum-400">
								Invited Account
							</span>
							<span className="font-medium text-gray-800 dark:text-platinum-100 truncate block">
								{invitation.email}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50/80 dark:bg-outer_space-600/40 border border-gray-100 dark:border-paynes_gray-600 text-gray-600 dark:text-platinum-300">
						<Clock size={16} className="text-amber-500 shrink-0" />
						<div className="min-w-0 flex-1">
							<span className="block text-[10px] uppercase font-semibold text-gray-400 dark:text-platinum-400">
								Expiration
							</span>
							<span className="font-medium text-gray-800 dark:text-platinum-100 truncate block">
								{formattedExpiry
									? `Valid until ${formattedExpiry}`
									: "Active Invitation"}
							</span>
						</div>
					</div>
				</div>

				{/* Note from Inviter (if provided) */}
				{invitation.notes && (
					<div className="relative rounded-2xl bg-amber-50/60 dark:bg-outer_space-600/50 border border-amber-200/50 dark:border-paynes_gray-600 p-4 shadow-sm">
						<div className="flex items-start gap-2.5">
							<Quote size={16} className="text-amber-500/80 shrink-0 mt-0.5" />
							<div className="space-y-0.5">
								<span className="text-[11px] font-semibold text-amber-900/80 dark:text-amber-300/90 uppercase tracking-wider block">
									Personal Note
								</span>
								<p className="text-xs text-gray-700 dark:text-platinum-200 italic leading-relaxed">
									&ldquo;{invitation.notes}&rdquo;
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="space-y-3 pt-1">
					<div className="flex flex-col-reverse sm:flex-row gap-3">
						<button
							type="button"
							disabled={actionLoading !== null}
							onClick={() => onResponse("decline")}
							className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-paynes_gray-600 py-3 px-4 text-sm font-semibold text-gray-700 dark:text-platinum-200 hover:bg-gray-100 dark:hover:bg-outer_space-400 disabled:opacity-50 transition active:scale-[0.98]"
						>
							{actionLoading === "decline" ? (
								<Loader2 className="animate-spin" size={18} />
							) : (
								<>
									<XCircle
										size={18}
										className="text-gray-400 dark:text-platinum-400"
									/>
									<span>Decline</span>
								</>
							)}
						</button>

						<button
							type="button"
							disabled={actionLoading !== null}
							onClick={() => onResponse("accept")}
							className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue_munsell-500 to-cyan-600 hover:from-blue_munsell-600 hover:to-cyan-700 py-3 px-4 text-sm font-semibold text-white disabled:opacity-50 transition shadow-lg shadow-blue_munsell-500/25 active:scale-[0.98]"
						>
							{actionLoading === "accept" ? (
								<Loader2 className="animate-spin" size={18} />
							) : !isSignedIn ? (
								<>
									<LogIn size={18} />
									<span>Sign In & Join Team</span>
								</>
							) : (
								<>
									<CheckCircle2 size={18} />
									<span>Accept & Join Team</span>
								</>
							)}
						</button>
					</div>

					{/* Security footnote */}
					<div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-platinum-400 pt-1">
						<ShieldCheck size={14} className="text-emerald-500" />
						<span>Encrypted invitation verified by Projectnify</span>
					</div>
				</div>
			</div>
		</div>
	);
}
