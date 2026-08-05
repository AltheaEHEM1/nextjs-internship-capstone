import { useState } from "react";

export function useProjectSettingsGeneralState(
	initialTitle: string,
	initialDescription: string,
	initialTeam: string,
	initialAccess: "administrator" | "member" | "viewer",
) {
	const [title, setTitle] = useState(initialTitle);
	const [description, setDescription] = useState(initialDescription);
	const [team, setTeam] = useState(initialTeam);
	const [access, setAccess] = useState<"administrator" | "member" | "viewer">(
		initialAccess,
	);

	const [isEditingGeneral, setIsEditingGeneral] = useState(false);
	const [tempTitle, setTempTitle] = useState(title);
	const [tempDescription, setTempDescription] = useState(description);

	const handleSaveGeneral = () => {
		setTitle(tempTitle);
		setDescription(tempDescription);
		setIsEditingGeneral(false);
	};

	const handleCancelGeneral = () => {
		setTempTitle(title);
		setTempDescription(description);
		setIsEditingGeneral(false);
	};

	return {
		title,
		description,
		team,
		access,
		setTitle,
		setDescription,
		setTeam,
		setAccess,
		isEditingGeneral,
		setIsEditingGeneral,
		tempTitle,
		setTempTitle,
		tempDescription,
		setTempDescription,
		handleSaveGeneral,
		handleCancelGeneral,
	};
}
