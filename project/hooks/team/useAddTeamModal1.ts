import { useEffect, useState } from "react";

export interface UseAddTeamModal1Params {
	initialData?: { teamName?: string; teamIcon?: string; coverUrl?: string };
	onNext?: (data: {
		teamName: string;
		teamIcon: string;
		coverUrl: string;
	}) => void;
}

export function useAddTeamModal1({
	initialData,
	onNext,
}: UseAddTeamModal1Params) {
	const [teamName, setTeamName] = useState(initialData?.teamName || "");
	const [teamIcon, setTeamIcon] = useState(initialData?.teamIcon || "💻");
	const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	useEffect(() => {
		if (initialData) {
			setTeamName(initialData.teamName || "");
			setTeamIcon(initialData.teamIcon || "💻");
			setCoverUrl(initialData.coverUrl || "");
		}
	}, [initialData]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const objectUrl = URL.createObjectURL(file);
			setCoverUrl(objectUrl);
		}
	};

	const handleNext = () => {
		if (onNext) {
			onNext({ teamName, teamIcon, coverUrl });
		}
	};

	return {
		teamName,
		setTeamName,
		teamIcon,
		setTeamIcon,
		coverUrl,
		setCoverUrl,
		showEmojiPicker,
		setShowEmojiPicker,
		handleFileChange,
		handleNext,
	};
}
