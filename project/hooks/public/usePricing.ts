import { useMemo, useState, useRef, type MouseEvent } from "react";

export type PricingPlan = {
	name: string;
	badge?: string;
	description: string;
	monthlyPrice?: number;
	yearlyPrice?: number;
	customPrice?: string;
	priceSubtext?: string;
	features: string[];
	ctaText: string;
	ctaHref: string;
	highlighted: boolean;
};

export type PricingFaq = {
	question: string;
	answer: string;
};

export function usePricing() {
	const [isYearly, setIsYearly] = useState(false);
	const [openFaq, setOpenFaq] = useState<number | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	const plans: PricingPlan[] = useMemo(
		() => [
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
		],
		[],
	);

	const faqs: PricingFaq[] = useMemo(
		() => [
			{
				question: "Can I change my plan later?",
				answer:
					"Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your account settings page.",
			},
			{
				question: "Is there a free trial available?",
				answer:
					"All paid plans come with a 14-day free trial. No credit card required to get started.",
			},
			{
				question: "How does annual billing work?",
				answer:
					"When you choose yearly billing, you are billed upfront for 12 months at a 20% discount compared to monthly billing.",
			},
		],
		[],
	);

const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return {
		isYearly,
		setIsYearly,
		openFaq,
		setOpenFaq,
		mousePosition,
		containerRef,
		handleMouseMove,
		plans,
		faqs,
	};
}
