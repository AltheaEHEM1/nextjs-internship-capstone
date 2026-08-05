// hooks/public/usePricing.ts
"use client";

import { useState, useRef, useCallback } from "react";

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  customPrice?: string;
  priceSubtext?: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  ctaText: string;
  ctaHref: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for individuals just getting started.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Up to 3 projects",
      "Basic task management",
      "1 GB storage",
      "Community support",
    ],
    highlighted: false,
    ctaText: "Get Started Free",
    ctaHref: "/register",
  },
  {
    name: "Starter",
    description: "Great for small teams and freelancers.",
    monthlyPrice: 9,
    yearlyPrice: 7,
    features: [
      "Up to 10 projects",
      "Advanced task management",
      "10 GB storage",
      "Email support",
      "Team collaboration",
    ],
    highlighted: false,
    ctaText: "Start Starter",
    ctaHref: "/register?plan=starter",
  },
  {
    name: "Pro",
    description: "For growing teams who need more power.",
    monthlyPrice: 29,
    yearlyPrice: 23,
    features: [
      "Unlimited projects",
      "Priority task management",
      "100 GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    highlighted: true,
    badge: "Most Popular",
    ctaText: "Go Pro",
    ctaHref: "/register?plan=pro",
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations.",
    customPrice: "Custom",
    priceSubtext: "Contact us for pricing",
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "SLA guarantee",
      "SSO & advanced security",
      "Custom onboarding",
      "24/7 phone support",
    ],
    highlighted: false,
    ctaText: "Contact Sales",
    ctaHref: "/contact",
  },
];

const faqs: FaqItem[] = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences automatically.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Absolutely. Every paid plan comes with a 14-day free trial — no credit card required. You can explore all features before committing.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayPal and bank transfers for Enterprise customers.",
  },
  {
    question: "How does the yearly billing discount work?",
    answer:
      "Choosing yearly billing gives you 2 months free (equivalent to a 20% discount). You're billed once per year at the discounted rate shown.",
  },
  {
    question: "Can I add more team members later?",
    answer:
      "Yes! You can invite additional team members at any time from your dashboard. Seats are billed on a per-user basis for Starter and Pro plans.",
  },
];

/**
 * Custom hook for the Pricing page.
 * Provides plan data, FAQ data, billing toggle, FAQ accordion, and cursor spotlight state.
 */
export function usePricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    []
  );

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
  } as const;
}
