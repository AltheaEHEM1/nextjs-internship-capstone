"use client";

import { useCallback, useState } from "react";

export function useAddPriority(
	initialName = "",
	initialDescription = "",
	initialColor = "bg-red-500 text-white",
	initialLevel = 1,
) {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);
	const [color, setColor] = useState(initialColor);
	const [level, setLevel] = useState<number>(initialLevel);

	const handleSubmit = useCallback(
		(
			e: React.FormEvent,
			onSave: (priority: {
				name: string;
				description: string;
				color: string;
				level: number;
			}) => void,
			onClose?: () => void,
		) => {
			e.preventDefault();
			if (!name.trim()) return;
			onSave({
				name: name.trim(),
				description: description.trim(),
				color,
				level,
			});
			setName("");
			setDescription("");
			setLevel(1);
			if (onClose) onClose();
		},
		[name, description, color, level],
	);

	return {
		name,
		setName,
		description,
		setDescription,
		color,
		setColor,
		level,
		setLevel,
		handleSubmit,
	} as const;
}
