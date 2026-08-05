"use client";

import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export function useHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const navLinks = [
		{ label: "Home", href: "/" },
		{ label: "Features", href: "/Features" },
		{ label: "Pricing", href: "/Pricing" },
		{ label: "About", href: "/About" },
	];

	const isActive = useCallback(
		(href: string) => {
			if (!pathname) return false;
			return href === "/"
				? pathname === "/"
				: pathname.toLowerCase().startsWith(href.toLowerCase());
		},
		[pathname],
	);

	const toggle = useCallback(() => setIsOpen((v) => !v), []);
	const close = useCallback(() => setIsOpen(false), []);

	return { isOpen, setIsOpen, toggle, close, navLinks, pathname, isActive };
}
