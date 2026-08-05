"use client";

import { useCallback, useState } from "react";

export function useAddStatus(
	initialName = "",
	initialDescription = "",
	initialColor = "",
) {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);
	const [color, setColor] = useState(initialColor);

	const handleSubmit = useCallback(
		(
			e: React.FormEvent,
			onSave: (status: {
				name: string;
				description: string;
				color: string;
			}) => void,
			onClose?: () => void,
		) => {
			e.preventDefault();
			if (!name.trim()) return;
			onSave({ name: name.trim(), description: description.trim(), color });
			setName("");
			setDescription("");
			setColor(initialColor);
			if (onClose) onClose();
		},
		[name, description, color, initialColor],
	);

	return {
		name,
		setName,
		description,
		setDescription,
		color,
		setColor,
		handleSubmit,
	} as const;
}
