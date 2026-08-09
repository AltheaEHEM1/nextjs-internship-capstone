"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import BaseModal from "@/components/layout/BaseModal";
import { ALL_POSSIBLE_VIEWS } from "@/hooks/project/useCustomView";
import { useCustomViewStore } from "../../../stores/custom-view-store";

interface CustomViewProps {
	opened: boolean;
	onClose: () => void;
	onBack?: () => void;
	selectedViews: string[];
	onChangeViews: (views: string[]) => void;
}

export default function CustomView({
	opened,
	onClose,
	onBack,
	selectedViews,
	onChangeViews,
}: CustomViewProps) {
	// Initialize store with props
	useEffect(() => {
		useCustomViewStore.getState().initialize(selectedViews, onChangeViews);
	}, [selectedViews, onChangeViews]);

	const { selectedViews: storeViews, toggleView } = useCustomViewStore(
		useShallow((state) => ({
			selectedViews: state.selectedViews,
			toggleView: state.toggleView,
		})),
	);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onBack ?? onClose}
						className="rounded-lg p-1 hover:bg-gray-100 transition dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
					>
						<ArrowLeft size={20} />
					</button>
					<span>Default settings for views</span>
				</div>
			}
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
			<div className="space-y-4">
				<p className="text-xs text-gray-400">
					Set up views that appear automatically in every Space, Folder, or List
					— and can't be removed.
				</p>
				<div className="space-y-2">
					{ALL_POSSIBLE_VIEWS.map(({ name, required }) => {
						const active = storeViews.includes(name) || required;
						return (
							<div
								key={name}
								className="flex items-center justify-between rounded-lg border border-gray-250 bg-gray-200 px-4 py-3"
							>
								<span className="text-sm font-medium text-gray">
									{name}{" "}
									{required && (
										<span className="text-xs text-gray-500">— Required</span>
									)}
								</span>
								<div className="flex items-center gap-3">
									{required && (
										<span className="text-xs text-gray-400">Default</span>
									)}
									<label
										htmlFor={`view-${name}`}
										className="relative inline-flex cursor-pointer items-center"
									>
										<input
											type="checkbox"
											id={`view-${name}`}
											checked={active}
											disabled={required}
											onChange={() => toggleView(name)}
											className="peer sr-only"
										/>
										<div className="peer h-5 w-9 rounded-full bg-gray-700 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#1e9b65] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</BaseModal>
	);
}
