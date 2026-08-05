"use client";

import { useCallback, useState } from "react";

export function useAddLabel(initialName = "", initialColor = "") {
	const [name, setName] = useState(initialName);
	const [selectedColor, setSelectedColor] = useState(initialColor);

	const handleSubmit = useCallback(
		(
			e: React.FormEvent,
			onSave: (label: { name: string; color: string }) => void,
			onClose?: () => void,
		) => {
			e.preventDefault();
			if (!name.trim()) return;
			onSave({ name: name.trim(), color: selectedColor });
			setName("");
			if (onClose) onClose();
		},
		[name, selectedColor],
	);

	return {
		name,
		setName,
		selectedColor,
		setSelectedColor,
		handleSubmit,
	} as const;
}
