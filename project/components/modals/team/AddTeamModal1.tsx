"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { FolderPlus, Upload, X } from "lucide-react";
import { useEffect } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useTeamManagement } from "@/hooks/team/useTeamManagement";
import { useTeamStore } from "@/stores/team/useTeamStore";

export interface AddTeam1Props {
	opened: boolean;
	onClose: () => void;
	onNext?: () => void;
	initialData?: {
		teamName?: string;
		teamIcon?: string;
		coverUrl?: string;
	};
}

export default function AddTeamModal1({
	opened,
	onClose,
	onNext,
	initialData,
}: AddTeam1Props) {
	const teamName = useTeamStore((s) => s.teamName);
	const setTeamName = useTeamStore((s) => s.setTeamName);
	const teamIcon = useTeamStore((s) => s.teamIcon);
	const setTeamIcon = useTeamStore((s) => s.setTeamIcon);
	const coverUrl = useTeamStore((s) => s.coverUrl);
	const setCoverUrl = useTeamStore((s) => s.setCoverUrl);
	const showEmojiPicker = useTeamStore((s) => s.showEmojiPicker);
	const setShowEmojiPicker = useTeamStore((s) => s.setShowEmojiPicker);

	// Pull handlers from the hook
	const { handleFileChange, handleTeamStep1Next } = useTeamManagement();

	// Populate store state if initialData is provided on modal open
	useEffect(() => {
		if (opened && initialData) {
			if (initialData.teamName !== undefined) setTeamName(initialData.teamName);
			if (initialData.teamIcon !== undefined) setTeamIcon(initialData.teamIcon);
			if (initialData.coverUrl !== undefined) setCoverUrl(initialData.coverUrl);
		}
		// eslint-disable-next-deps
	}, [opened]);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					<FolderPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Create New Sub-Team</span>
				</div>
			}
			footer={
				<>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-platinum-300 dark:hover:bg-outer_space-400 transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onNext || handleTeamStep1Next}
						className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition"
					>
						Next
					</button>
				</>
			}
		>
			<div className="space-y-4">
				<div className="space-y-3">
					<div>
						<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Team Name
						</label>
						<input
							type="text"
							placeholder="e.g. Core Architecture Unit"
							value={teamName}
							onChange={(e) => setTeamName(e.target.value)}
							className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
						/>
					</div>
					<div className="relative">
						<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Team Icon / Emoji
						</label>
						<div className="mt-1 flex items-center gap-2">
							<button
								type="button"
								onClick={() => setShowEmojiPicker(!showEmojiPicker)}
								className="flex items-center gap-2 rounded-lg border border-french_gray-300 px-3 py-2 text-lg dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100 hover:border-blue_munsell-500 transition"
							>
								<span>{teamIcon}</span>
								<span className="text-xs text-outer_space-400 dark:text-platinum-300 font-normal">
									Change Emoji
								</span>
							</button>
						</div>
						{showEmojiPicker && (
							<div className="absolute left-0 top-full z-[60] mt-2">
								<div
									className="fixed inset-0 z-40"
									onClick={() => setShowEmojiPicker(false)}
								/>
								<div className="relative z-50 shadow-2xl rounded-xl overflow-hidden">
									<EmojiPicker
										theme={Theme.AUTO}
										onEmojiClick={(emojiData) => {
											setTeamIcon(emojiData.emoji);
											setShowEmojiPicker(false);
										}}
									/>
								</div>
							</div>
						)}
					</div>
					<div>
						<label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
							Cover Picture (Optional)
						</label>
						{coverUrl ? (
							<div className="relative mt-1 h-32 w-full overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-600">
								<img
									src={coverUrl}
									alt="Cover preview"
									className="h-full w-full object-cover"
								/>
								<button
									type="button"
									onClick={() => setCoverUrl("")}
									className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black transition"
								>
									<X size={16} />
								</button>
							</div>
						) : (
							<label className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-french_gray-300 p-4 text-center cursor-pointer hover:border-blue_munsell-500 dark:border-payne's_gray-600 dark:bg-outer_space-400 transition">
								<Upload
									size={20}
									className="text-outer_space-400 dark:text-platinum-300 mb-1"
								/>
								<span className="text-xs text-outer_space-500 dark:text-platinum-300 font-medium">
									Click to upload cover image
								</span>
								<span className="text-[10px] text-outer_space-400 dark:text-platinum-400">
									PNG, JPG, WEBP up to 5MB
								</span>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
							</label>
						)}
					</div>
				</div>
			</div>
		</BaseModal>
	);
}
