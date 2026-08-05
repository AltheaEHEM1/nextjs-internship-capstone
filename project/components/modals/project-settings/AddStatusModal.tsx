"use client";

import { Layers } from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";
import { useAddStatus } from "@/hooks/project-settings/useAddStatus";
import { cn } from "@/lib/utils";

interface AddStatusProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (status: {
		name: string;
		description: string;
		color: string;
	}) => void;
}

const PRESET_COLORS = [
	{
		label: "Blue",
		value:
			"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
	},
	{
		label: "Amber",
		value:
			"bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
	},
	{
		label: "Emerald",
		value:
			"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
	},
	{
		label: "Purple",
		value:
			"bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
	},
	{
		label: "Rose",
		value:
			"bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
	},
];

export function AddStatusModal({ isOpen, onClose, onSave }: AddStatusProps) {
	const {
		name,
		setName,
		description,
		setDescription,
		color,
		setColor,
		handleSubmit,
	} = useAddStatus("", "", PRESET_COLORS[0].value);

	return (
		<BaseModal opened={isOpen} onClose={onClose} width={448}>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<div className="rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 p-2 text-cyan-600 dark:text-cyan-400">
						<Layers size={18} />
					</div>
					<h3 className="text-base font-semibold text-slate-900 dark:text-white font-['Poppins',sans-serif]">
						Add New Status
					</h3>
				</div>
			</div>

			{/* Form */}
			<form
				onSubmit={(e) => handleSubmit(e, onSave, onClose)}
				className="p-6 space-y-4"
			>
				<div>
					<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
						Status Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. In Review, Backlog"
						required
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
					/>
				</div>

				<div>
					<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Briefly describe when to use this status..."
						rows={2}
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 resize-none"
					/>
				</div>

				<div>
					<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
						Theme Color
					</label>
					<div className="flex items-center gap-2 pt-1">
						{PRESET_COLORS.map((c) => (
							<button
								key={c.label}
								type="button"
								onClick={() => setColor(c.value)}
								className={cn(
									"h-7 w-7 rounded-full transition-transform border",
									c.value.split(" ")[0],
									color === c.value
										? "ring-2 ring-offset-2 ring-cyan-500 scale-110"
										: "opacity-80 hover:opacity-100",
								)}
								title={c.label}
							/>
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
						Save Status
					</button>
				</div>
			</form>
		</BaseModal>
	);
}
