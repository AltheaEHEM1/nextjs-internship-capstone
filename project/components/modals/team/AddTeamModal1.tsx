"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { ImagePlus, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
	const coverUrl = useTeamStore((s) => s.coverUrl);
	const setTeamName = useTeamStore((s) => s.setTeamName);
	const setTeamIcon = useTeamStore((s) => s.setTeamIcon);
	const setCoverUrl = useTeamStore((s) => s.setCoverUrl);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!opened) {
			useTeamStore.getState().resetTeamForm();
		}
	}, [opened]);

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
			title={
				<div className="flex items-center gap-2">
					<UserPlus size={22} style={{ color: "#1e9b65" }} />
					<span>Create a new team</span>
				</div>
			}
		>
			<div className="space-y-4">
				<div>
					<label
						htmlFor="teamName"
						className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
					>
						Team Name <span className="text-red-500">*</span>
					</label>
					<input
						id="teamName"
						type="text"
						value={teamName}
						required
						onChange={(e) => setTeamName(e.target.value)}
						placeholder="e.g. Core Engineering"
						className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
					/>
				</div>
				<div>
					<label
						htmlFor="coverPhoto"
						className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
					>
						Cover Photo
					</label>
					{coverUrl ? (
						<div className="relative mt-2 h-32 w-full rounded-xl border border-french_gray-200 overflow-hidden dark:border-paynes_gray-600">
							<Image
								src={coverUrl}
								alt="Cover"
								fill
								unoptimized
								className="object-cover"
							/>
							<button
								type="button"
								onClick={() => setCoverUrl("")}
								className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
							>
								<X size={16} />
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="mt-2 flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-french_gray-200 bg-gray-50 hover:bg-gray-100 dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:hover:bg-outer_space-300 transition-colors"
						>
							<ImagePlus className="mb-2 h-6 w-6 text-gray-400" />
							<span className="text-xs text-gray-500">
								Click to upload a cover photo
							</span>
							<input
								type="file"
								ref={fileInputRef}
								accept="image/*"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										const reader = new FileReader();
										reader.onloadend = () => {
											if (typeof reader.result === "string") {
												setCoverUrl(reader.result);
											}
										};
										reader.readAsDataURL(file);
									}
								}}
							/>
						</button>
					)}
				</div>
				<div>
					<label
						htmlFor="teamIcon"
						className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
					>
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
