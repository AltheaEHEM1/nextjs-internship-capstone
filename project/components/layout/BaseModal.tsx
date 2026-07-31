"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface BaseModalProps {
	opened: boolean;
	onClose: () => void;
	title?: string | React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
	width?: number | string;
}

export default function BaseModal({
	opened,
	onClose,
	title,
	children,
	footer,
	width = 600,
}: BaseModalProps) {
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	if (!opened) return null;

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close modal overlay"
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onClose();
				}}
			/>

			<div
				className="relative z-50 flex max-h-[70vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
				style={{ maxWidth: width }}
			>
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between p-4 pb-1">
					{typeof title === "string" ? (
						<h2
							className="text-xl font-semibold font-mono"
							style={{ color: "#1e9b65" }}
						>
							{title}
						</h2>
					) : (
						title
					)}
					<button
						type="button"
						onClick={onClose}
						className="rounded-full p-1 transition hover:bg-gray-100"
					>
						<X size={24} />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
					{children}
				</div>

				{footer && (
					<div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 p-4">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
