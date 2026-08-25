"use client";

import { AlertTriangle } from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";

interface ConfirmDialogProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "danger" | "default";
	loading?: boolean;
}

export default function ConfirmDialog({
	opened,
	onClose,
	onConfirm,
	title = "Are you sure?",
	description = "This action cannot be undone.",
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "danger",
	loading = false,
}: ConfirmDialogProps) {
	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={420}
			title={
				<div className="flex items-center gap-2">
					<div
						className={`flex h-8 w-8 items-center justify-center rounded-full ${
							variant === "danger"
								? "bg-rose-100 text-rose-600"
								: "bg-blue_munsell-100 text-blue_munsell-600"
						}`}
					>
						<AlertTriangle size={18} />
					</div>
					<span className="text-base font-semibold">{title}</span>
				</div>
			}
			footer={
				<div className="flex w-full justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="rounded-xl px-4 py-2 text-xs font-semibold text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 transition-colors"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={loading}
						className={`rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors disabled:opacity-50 ${
							variant === "danger"
								? "bg-rose-600 hover:bg-rose-700"
								: "bg-blue_munsell-500 hover:bg-blue_munsell-600"
						}`}
					>
						{loading ? "Processing..." : confirmLabel}
					</button>
				</div>
			}
		>
			<p className="text-sm text-outer_space-500 dark:text-platinum-300">
				{description}
			</p>
		</BaseModal>
	);
}
