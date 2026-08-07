"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useState } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useTeamStore } from "@/stores/team/useTeamStore";

export interface AddTeam1Props {
	opened: boolean;
	onClose: () => void;
	onNext: () => void;
}

export default function AddTeamModal1({
	opened,
	onClose,
	onNext,
}: AddTeam1Props) {
	const teamName = useTeamStore((s) => s.teamName);
	const teamIcon = useTeamStore((s) => s.teamIcon);
	const setTeamName = useTeamStore((s) => s.setTeamName);
	const setTeamIcon = useTeamStore((s) => s.setTeamIcon);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	if (!opened) return null;

	const handleNextClick = () => {
		if (!teamName.trim()) return;
		onNext();
	};

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={450}
			title="Create a New Team"
		>
			<div className="space-y-4">
				<div>
					<label className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300">
						Team Name
					</label>
					<input
						type="text"
						value={teamName}
						onChange={(e) => setTeamName(e.target.value)}
						placeholder="e.g. Core Engineering"
						className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
					/>
				</div>
				<div>
					<label className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300">
						Team Icon / Emoji
					</label>
					<div className="flex items-center gap-3 mt-1">
						<button
							type="button"
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							className="flex h-10 w-10 items-center justify-center rounded-xl border border-french_gray-200 text-xl bg-white dark:bg-outer_space-400 dark:border-paynes_gray-600"
						>
							{teamIcon}
						</button>
						<span className="text-xs text-gray-400">Click to pick an icon</span>
					</div>
					{showEmojiPicker && (
						<div className="mt-2">
							<EmojiPicker
								theme={Theme.AUTO}
								onEmojiClick={(emojiData) => {
									setTeamIcon(emojiData.emoji);
									setShowEmojiPicker(false);
								}}
							/>
						</div>
					)}
				</div>
				<div className="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl px-4 py-2 text-xs font-semibold text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleNextClick}
						disabled={!teamName.trim()}
						className="rounded-xl bg-blue_munsell-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue_munsell-600 disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</BaseModal>
	);
}
