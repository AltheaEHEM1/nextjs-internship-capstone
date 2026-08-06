"use client";

import { Tag } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import BaseModal from "@/components/layout/BaseModal";
import { cn } from "@/lib/utils";
import { useCustomLabelStore } from "../../../stores/custom-label-store";

interface AddLabelProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (label: { name: string; color: string }) => void;
}

const LABEL_COLORS = [
	{
		name: "Cyan",
		class: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
	},
	{
		name: "Blue",
		class: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
	},
	{
		name: "Emerald",
		class:
			"bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
	},
	{
		name: "Purple",
		class:
			"bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
	},
	{
		name: "Amber",
		class:
			"bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
	},
	{
		name: "Rose",
		class: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
	},
];

export function AddLabelModal({ isOpen, onClose, onSave }: AddLabelProps) {
	const { name, setName, selectedColor, setSelectedColor, handleSubmit } =
		useCustomLabelStore(
			useShallow((state) => ({
				name: state.name,
				setName: state.setName,
				selectedColor: state.selectedColor,
				setSelectedColor: state.setSelectedColor,
				handleSubmit: state.handleSubmit,
			})),
		);

	// Initialize store with callbacks when component mounts/updates
	useEffect(() => {
		useCustomLabelStore
			.getState()
			.initialize("", LABEL_COLORS[0].class, onSave, onClose);
	}, [onSave, onClose]);

	return (
		<BaseModal opened={isOpen} onClose={onClose} width={448}>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<div className="rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 p-2 text-cyan-600 dark:text-cyan-400">
						<Tag size={18} />
					</div>
					<h3 className="text-base font-semibold text-slate-900 dark:text-white font-['Poppins',sans-serif]">
						Add New Label
					</h3>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="p-6 space-y-4">
				<div>
					<label
						htmlFor="label-name"
						className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
					>
						Label Name
					</label>
					<input
						id="label-name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Frontend, Bug, Feature"
						required
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
					/>
				</div>

				<div>
					<label
						htmlFor="badge-preview"
						className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2"
					>
						Badge Preview & Style
					</label>
					<div className="mb-3">
						<span
							className={cn(
								"inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border",
								selectedColor,
							)}
						>
							<Tag size={12} />
							{name || "Preview Label"}
						</span>
					</div>
					<div className="grid grid-cols-3 gap-2">
						{LABEL_COLORS.map((c) => (
							<button
								key={c.name}
								type="button"
								onClick={() => setSelectedColor(c.class)}
								className={cn(
									"rounded-xl px-3 py-2 text-xs font-medium border transition-all",
									c.class,
									selectedColor === c.class
										? "ring-2 ring-cyan-500 shadow-xs"
										: "opacity-70 hover:opacity-100",
								)}
							>
								{c.name}
							</button>
						))}
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all"
					>
						Save Label
					</button>
				</div>
			</form>
		</BaseModal>
	);
}
