"use client";

import {
	CheckCircle2,
	CircleDot,
	MoreHorizontal,
	Plus,
	Trash2,
} from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";
import { useEffect } from "react";
import { useCustomStatusStore } from "../../../stores/custom-status-store";

interface CustomStatusProps {
	opened: boolean;
	onClose: () => void;
	status: {
		notStarted: string[];
		active: string[];
		done: string[];
		closed: string[];
	};
	onChangeStatus: (status: any) => void;
}

export default function CustomStatus({
	opened,
	onClose,
	status,
	onChangeStatus,
}: CustomStatusProps) {
	// Initialize the store with props when component mounts/updates
	useEffect(() => {
	  useCustomStatusStore.getState().initialize(status, onChangeStatus);
	}, [status, onChangeStatus]);

	const { inputs, setInputs, handleAdd, handleRemove, addPrompted } = useCustomStatusStore();


	const categories = [
		{ key: "notStarted", label: "Not started" },
		{ key: "active", label: "Active" },
		{ key: "done", label: "Done" },
		{ key: "closed", label: "Closed" },
	] as const;

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title="Task Statuses"
			footer={
				<button
					type="button"
					onClick={onClose}
					className="w-full rounded-lg bg-[#1e9b65] py-2 text-sm font-medium text-white shadow hover:opacity-95 transition"
				>
					Done
				</button>
			}
		>
			<div className="space-y-6">
				{categories.map(({ key, label }) => (
					<div key={key} className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-xs font-semibold tracking-wider text-gray-500">
								{label}
							</span>
							<button
								type="button"
								onClick={() => addPrompted(key, label)}
								className="text-gray-100 hover:text-white"
							>
								<Plus size={16} />
							</button>
						</div>

						<div className="space-y-2">
							{status[key].map((item: string, index: number) => (
								<div
									key={index}
									className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-300 px-4 py-2.5 shadow-xs"
								>
									<div className="flex items-center gap-3">
										<span className="text-gray-600">⠿</span>
										{key === "done" || key === "closed" ? (
											<CheckCircle2 size={16} className="text-emerald-500" />
										) : (
											<CircleDot size={16} className="text-indigo-400" />
										)}
										<span className="text-xs font-bold tracking-wide text-gray uppercase">
											{item}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => handleRemove(key, index)}
											className="text-gray-500 hover:text-red-400"
										>
											<Trash2 size={14} />
										</button>
										<MoreHorizontal size={16} className="text-gray-500" />
									</div>
								</div>
							))}

							<button
								type="button"
								onClick={() => addPrompted(key, label)}
								className="w-full rounded-lg border border-dashed border-gray-700 bg-transparent py-2 text-center text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200 transition"
							>
								+ Add status
							</button>
						</div>
					</div>
				))}
			</div>
		</BaseModal>
	);
}
