"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { cn } from "@/lib/utils";

interface AddPriorityProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (priority: {
		name: string;
		description: string;
		color: string;
		level: number;
	}) => void;
}

const PRESET_COLORS = [
	{ label: "Red", value: "bg-red-500 text-white" },
	{ label: "Orange", value: "bg-orange-500 text-white" },
	{ label: "Amber", value: "bg-amber-500 text-white" },
	{ label: "Green", value: "bg-emerald-500 text-white" },
	{ label: "Cyan", value: "bg-cyan-500 text-white" },
	{ label: "Blue", value: "bg-blue-500 text-white" },
	{ label: "Purple", value: "bg-purple-500 text-white" },
];

export function AddPriorityModal({
	isOpen,
	onClose,
	onSave,
}: AddPriorityProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState(PRESET_COLORS[0].value);
	const [level, setLevel] = useState(1);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSave({ name, description, color, level });
		setName("");
		setDescription("");
		setLevel(1);
		onClose();
	};

	return (
		<BaseModal opened={isOpen} onClose={onClose} width={448}>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<div className="rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 p-2 text-cyan-600 dark:text-cyan-400">
						<Flag size={18} />
					</div>
					<h3 className="text-base font-semibold text-slate-900 dark:text-white font-['Poppins',sans-serif]">
						Add New Priority
					</h3>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="p-6 space-y-4">
				<div>
					<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
						Priority Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Critical, Urgent"
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
						placeholder="Briefly describe when to use this priority..."
						rows={2}
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 resize-none"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
							Weight Level (Order)
						</label>
						<input
							type="number"
							value={level}
							onChange={(e) => setLevel(Number(e.target.value))}
							min={1}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						/>
					</div>
					<div>
						<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
							Theme Color
						</label>
						<div className="flex items-center gap-1.5 pt-1">
							{PRESET_COLORS.map((c) => (
								<button
									key={c.label}
									type="button"
									onClick={() => setColor(c.value)}
									className={cn(
										"h-7 w-7 rounded-full transition-transform",
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
						Save Priority
					</button>
				</div>
			</form>
		</BaseModal>
	);
}
