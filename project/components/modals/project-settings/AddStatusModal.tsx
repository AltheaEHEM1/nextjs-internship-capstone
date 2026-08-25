"use client";

import { Layers } from "lucide-react";
import { useEffect, useState } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useToast } from "@/hooks/toast/use-toast";
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
	const { toast } = useToast();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState(PRESET_COLORS[0].value);
	const [maxLengthError, setMaxLengthError] = useState("");

	const onFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSave({ name: name.trim(), description, color });

		toast({
			title: "Status added",
			description: "New status has been created.",
			variant: "success",
		});

		setName("");
		setDescription("");
		setColor(PRESET_COLORS[0].value);
		onClose();
	};

	useEffect(() => {
		if (!isOpen) {
			setName("");
			setDescription("");
			setColor(PRESET_COLORS[0].value);
		}
	}, [isOpen]);

	return (
		<BaseModal
			opened={isOpen}
			onClose={onClose}
			width={448}
			title={
				<div className="flex items-center gap-3">
					<div className="rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 p-2.5 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-2xs">
						<Layers size={18} />
					</div>
					<div>
						<h3 className="text-base font-semibold text-slate-900 dark:text-white font-['Poppins',sans-serif]">
							Add New Status
						</h3>
						<p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
							Create a custom status for your board
						</p>
					</div>
				</div>
			}
		>
			{/* Form */}
			<form onSubmit={onFormSubmit} className="p-6 space-y-5">
				<div className="space-y-1.5">
					<label
						htmlFor="statusName"
						className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
					>
						Status Name
					</label>
					<input
						id="statusName"
						type="text"
						value={name}
						onChange={(e) => {
							let val = e.target.value.replace(/\s{2,}/g, " ");
							if (val.length > 20) {
								val = val.slice(0, 20);
								setMaxLengthError("Status name is too long");
							} else {
								setMaxLengthError("");
							}
							setName(val);
						}}
						placeholder="e.g. In Review, Backlog"
						required
						className={`w-full rounded-xl border bg-slate-50/60 dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 transition-all shadow-2xs ${maxLengthError ? "border-red-500 focus:ring-red-500/40 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:ring-cyan-500/40 focus:border-cyan-500"}`}
					/>
					{maxLengthError && (
						<p className="mt-1 text-xs text-red-500 font-medium">
							{maxLengthError}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<label
						htmlFor="badge-preview"
						className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
					>
						Status Preview & Style
					</label>
					<div className="mb-3">
						<span
							className={cn(
								"inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border",
								color,
							)}
						>
							<Layers size={12} />
							{name || "Preview Status"}
						</span>
					</div>
					<div className="flex items-center gap-2.5 pt-0.5">
						{PRESET_COLORS.map((c) => (
							<button
								key={c.label}
								type="button"
								onClick={() => setColor(c.value)}
								className={cn(
									"h-8 w-8 rounded-full transition-all duration-200 border cursor-pointer",
									c.value,
									color === c.value
										? "ring-2 ring-offset-2 ring-cyan-500 scale-110 shadow-sm"
										: "opacity-75 hover:opacity-100 hover:scale-105",
								)}
								title={c.label}
							/>
						))}
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-xl bg-cyan-500 hover:bg-cyan-600 active:scale-95 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
					>
						Save Status
					</button>
				</div>
			</form>
		</BaseModal>
	);
}
