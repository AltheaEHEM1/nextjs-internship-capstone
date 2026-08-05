"use client";

import { useEffect } from "react";

export function useModal(opened: boolean, onClose: () => void) {
	useEffect(() => {
		if (!opened) return;

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [opened, onClose]);
}
