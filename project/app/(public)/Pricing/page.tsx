"use client";
import { ArrowRight, Check, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePricingSpotlight } from "@/hooks/public/usePublic";
import { usePublicStore } from "@/stores/public/PublicStore";

export function Pricing() {
	const isYearly = usePublicStore((state) => state.isYearly);
	const setIsYearly = usePublicStore((state) => state.setIsYearly);

	const { mousePosition, containerRef, handleMouseMove } =
		usePricingSpotlight();

	const plans = [
		{
			name: "Starter",
			description: "Perfect for individuals and small personal projects.",
			monthlyPrice: 9,
			yearlyPrice: 7,
			features: [
				"Up to 3 active projects",
				"Basic Kanban boards",
				"Task management & deadlines",
				"Limited team collaboration",
				"Email support",
			],
			ctaText: "Get Started",
			ctaHref: "#",
			highlighted: false,
		},
		{
			name: "Pro",
			description: "Best for growing teams and active freelancers.",
			monthlyPrice: 24,
			yearlyPrice: 19,
			features: [
				"Unlimited active projects",
				"Advanced Kanban workflows",
				"Team collaboration tools",
				"File attachments & comments",
				"Progress analytics & reports",
				"Priority email support",
			],
			ctaText: "Get Pro",
			ctaHref: "#",
			highlighted: false,
		},
		{
			name: "Business",
			badge: "Most Popular",
			description: "Designed for companies and large-scale project teams.",
			monthlyPrice: 79,
			yearlyPrice: 63,
			features: [
				"Unlimited projects & members",
				"Advanced permissions & roles",
				"Real-time collaboration",
				"Custom workflows & automation",
				"Admin dashboard & reporting",
				"Dedicated onboarding manager",
			],
			ctaText: "Get Business",
			ctaHref: "#",
			highlighted: true,
		},
		{
			name: "Enterprise",
			description: "For organizations with strict security and custom needs.",
			customPrice: "Custom",
			priceSubtext: "Tailored to your organization",
			features: [
				"Everything in Business",
				"SAML/SSO and security controls",
				"Custom API & integrations",
				"Dedicated account manager",
				"Custom SLA guarantees",
			],
			ctaText: "Contact Sales",
			ctaHref: "#",
			highlighted: false,
		},
	];

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Visual effect spotlight only
		<section
			ref={containerRef}
			onMouseMove={handleMouseMove}
			role="presentation"
			className="relative px-4 py-12 sm:py-24 sm:px-8 lg:px-12 overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-teal-500 selection:text-white border-t border-slate-800/80"
		>
			{/* Interactive Cursor Spotlight Glow */}
			<div
				className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-80"
				style={{
					background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 166, 0.15), transparent 40%)`,
				}}
			/>
			<div className="absolute top-12 left-1/2 -translate-x-1/2 w-[320px] sm:w-[900px] h-[350px] bg-gradient-to-r from-teal-500/15 via-blue-600/15 to-indigo-600/15 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />
			<div className="absolute top-2/3 right-0 w-[250px] sm:w-[450px] h-[450px] bg-indigo-600/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
			<div className="absolute bottom-10 left-0 w-[250px] sm:w-[450px] h-[450px] bg-teal-500/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
			{/* Isometric/Diamond Grid Pattern Overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#33415525_1px,transparent_1px),linear-gradient(to_bottom,#33415525_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] pointer-events-none" />
			<div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
				{/* Header Section */}
				<div className="text-center max-w-3xl mb-10 sm:mb-16">
					<div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-teal-400 uppercase mb-4 sm:mb-6 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full shadow-sm backdrop-blur-md">
						<Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
						<span>Flexible Pricing</span>
						<Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
					</div>
					<h2 className="text-3xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-4 sm:mb-6 leading-tight">
						Scale your productivity. <br />
						<span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
							Transparent plans.
						</span>
					</h2>
					<p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal px-2 sm:px-0">
						Customize composition and business workflows with Projectnify.
						Interactive billing switch, elegant and smooth.
					</p>
					{/* Interactive Toggle Switch */}
					<div className="mt-8 sm:mt-10 inline-flex items-center p-1.5 bg-slate-900/90 rounded-full border border-slate-800 shadow-xl shadow-slate-950/50 backdrop-blur-xl relative w-full max-w-xs sm:w-auto">
						{/* Dynamic Sliding Pill Indicator */}
						<div
							className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out shadow-md shadow-blue-500/20 ${
								isYearly ? "left-[calc(50%+0.1875rem)]" : "left-1.5"
							}`}
						/>
						{/* Monthly Button  */}
						<button
							type="button"
							onClick={() => setIsYearly(false)}
							className={`relative z-10 flex-1 sm:w-40 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-200 text-center ${
								!isYearly ? "text-white" : "text-slate-400 hover:text-white"
							}`}
						>
							Monthly
						</button>
						{/* Yearly Button */}
						<button
							type="button"
							onClick={() => setIsYearly(true)}
							className={`relative z-10 flex-1 sm:w-40 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 ${
								isYearly ? "text-white" : "text-slate-400 hover:text-white"
							}`}
						>
							<span>Yearly</span>
							<span
								className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
									isYearly
										? "bg-white/20 text-white"
										: "bg-teal-500/10 text-teal-400 border border-teal-500/20"
								}`}
							>
								Save 20%
							</span>
						</button>
					</div>
				</div>
				{/* Pricing Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch mb-16 sm:mb-24">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`group relative backdrop-blur-xl rounded-3xl p-5 sm:p-7 border flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${
								plan.highlighted
									? "border-teal-400/80 shadow-[0_20px_50px_-10px_rgba(20,184,166,0.25)] ring-2 ring-teal-500/30 bg-gradient-to-b from-slate-900/90 via-teal-950/20 to-slate-900/90"
									: "bg-slate-900/50 border-slate-800/90 hover:border-teal-500/50 shadow-xl shadow-slate-950/50 hover:shadow-2xl hover:shadow-teal-500/10"
							}`}
						>
							{/* Highlight Badge */}
							{plan.badge && (
								<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md shadow-cyan-500/30">
									{plan.badge}
								</div>
							)}
							<div>
								{/* Header Icon & Card Title */}
								<div className="mb-6">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500/10 via-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-4 border border-teal-500/20 group-hover:scale-110 transition-transform">
										<Layers className="w-5 h-5 text-teal-400" />
									</div>
									<h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
										{plan.name}
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed min-h-[2.5rem]">
										{plan.description}
									</p>
								</div>
								{/* Price Display */}
								<div className="mb-8 min-h-[3.5rem] flex flex-col justify-center">
									{plan.customPrice ? (
										<div>
											<span className="text-4xl font-extrabold text-white tracking-tight">
												{plan.customPrice}
											</span>
											<p className="text-xs text-slate-400 mt-1">
												{plan.priceSubtext}
											</p>
										</div>
									) : (
										<div className="flex items-baseline gap-1">
											<span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
												${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
											</span>
											<span className="text-slate-400 font-semibold text-sm">
												/mo
											</span>
										</div>
									)}
								</div>
								{/* Features List */}
								<div className="space-y-3.5 mb-8 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
									{plan.features.map((feature) => (
										<div key={feature} className="flex items-start gap-3">
											<div className="p-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 mt-0.5 group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-slate-950 transition-all duration-300">
												<Check className="w-3 h-3" />
											</div>
											<span className="leading-tight text-slate-300 text-sm">
												{feature}
											</span>
										</div>
									))}
								</div>
							</div>
							{/* Call To Action Buttons */}
							<Link
								href={plan.ctaHref}
								className={`group/btn relative inline-flex items-center justify-center w-full py-3.5 px-6 font-semibold rounded-2xl text-center transition-all duration-300 overflow-hidden shadow-sm ${
									plan.highlighted
										? "bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
										: "bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700"
								}`}
							>
								<span className="relative z-10 flex items-center gap-2">
									{plan.ctaText}
									<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
								</span>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Pricing;
