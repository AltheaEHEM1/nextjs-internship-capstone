import { useEffect } from "react";

/**
 * Side-effect hook used by `BaseModal`.
 * - Locks body scroll while the modal is open.
 * - Closes the modal when the Escape key is pressed.
 */
export function useModal(opened: boolean, onClose: () => void) {
	// Lock body scroll
	useEffect(() => {
		if (!opened) return;

		const original = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = original;
		};
	}, [opened]);

	// Close on Escape
	useEffect(() => {
		if (!opened) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [opened, onClose]);
}
