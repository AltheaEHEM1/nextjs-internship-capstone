import EmojiPicker from "emoji-picker-react";
import { ImagePlus, Info, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface EditTeamModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		name: string;
		icon: string;
		coverUrl: string;
	}) => Promise<void>;
	initialData: {
		name: string;
		icon: string;
		coverUrl: string;
	};
}

export function EditTeamModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}: EditTeamModalProps) {
	const [name, setName] = useState(initialData.name);
	const [icon, setIcon] = useState(initialData.icon || "🚀");
	const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || "");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [maxLengthError, setMaxLengthError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError("Team name is required.");
			return;
		}

		setIsSubmitting(true);
		setError(null);
		try {
			await onSubmit({ name, icon, coverUrl });
			onClose();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to update team");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-outer_space-500">
				<h3 className="text-lg font-bold text-outer_space-800 dark:text-platinum-100">
					Edit Team
				</h3>
				<p className="mt-1 text-sm text-outer_space-500 dark:text-platinum-300">
					Update team name, icon and cover photo
				</p>

				<div className="space-y-6 pt-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="teamName"
								className="text-sm font-medium text-outer_space-800 dark:text-platinum-200"
							>
								Team Name <span className="text-rose-500">*</span>
							</label>
							<input
								id="teamName"
								type="text"
								value={name}
								onChange={(e) => {
									let val = e.target.value.replace(/\s{2,}/g, " ");
									if (val.length > 50) {
										val = val.slice(0, 50);
										setMaxLengthError("Team name is too long");
									} else {
										setMaxLengthError("");
									}
									setName(val);
								}}
								placeholder="e.g. Design Team"
								className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all dark:bg-outer_space-500 dark:text-white ${maxLengthError ? "border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-french_gray-200 focus:border-blue_munsell-500 focus:ring-4 focus:ring-blue_munsell-500/10 dark:border-paynes_gray-600"}`}
							/>
							{maxLengthError && (
								<p className="mt-1 text-xs text-red-500 font-medium">
									{maxLengthError}
								</p>
							)}
						</div>

						<div className="space-y-2 relative">
							<label
								htmlFor="teamIconBtn"
								className="text-sm font-medium text-outer_space-800 dark:text-platinum-200"
							>
								Team Icon
							</label>
							<div className="flex items-center gap-3">
								<button
									id="teamIconBtn"
									type="button"
									onClick={() => setShowEmojiPicker(!showEmojiPicker)}
									className="flex h-12 w-12 items-center justify-center rounded-xl border border-french_gray-200 bg-white text-2xl hover:bg-french_gray-50 dark:border-paynes_gray-600 dark:bg-outer_space-500 dark:hover:bg-outer_space-400"
								>
									{icon}
								</button>
								<span className="text-sm text-outer_space-500 dark:text-platinum-300">
									Choose an icon for your team
								</span>
							</div>
							{showEmojiPicker && (
								<div className="absolute top-20 z-50">
									<EmojiPicker
										onEmojiClick={(emojiObject) => {
											setIcon(emojiObject.emoji);
											setShowEmojiPicker(false);
										}}
									/>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<label
								htmlFor="coverUrl"
								className="text-sm font-medium text-outer_space-800 dark:text-platinum-200"
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

						<div className="rounded-xl bg-blue_munsell-50 p-4 flex items-start gap-3 dark:bg-blue_munsell-900/20">
							<Info
								className="text-blue_munsell-500 shrink-0 mt-0.5"
								size={16}
							/>
							<p className="text-xs text-blue_munsell-700 dark:text-blue_munsell-300">
								Team details can be updated anytime by a team administrator.
							</p>
						</div>

						{error && (
							<div className="rounded-xl bg-rose-50 p-4 flex items-start gap-3 dark:bg-rose-900/20">
								<Info className="text-rose-500 shrink-0 mt-0.5" size={16} />
								<p className="text-xs text-rose-700 dark:text-rose-300">
									{error}
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="mt-8 flex gap-3 sm:justify-end">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 sm:flex-none rounded-xl border border-french_gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-outer_space-700 hover:bg-french_gray-50 dark:border-paynes_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-outer_space-400"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting || !name.trim()}
						className="flex-1 sm:flex-none rounded-xl bg-blue_munsell-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue_munsell-600 disabled:opacity-50"
					>
						{isSubmitting ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
}
