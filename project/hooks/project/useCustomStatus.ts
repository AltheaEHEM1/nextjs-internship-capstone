"use client";

import { useCallback, useState } from "react";

type StatusShape = {
	notStarted: string[];
	active: string[];
	done: string[];
	closed: string[];
};

export function useCustomStatus(
	initialStatus: StatusShape,
	onChangeStatus: (s: StatusShape) => void,
) {
	const [inputs, setInputs] = useState({
		notStarted: "",
		active: "",
		done: "",
		closed: "",
	});

	const handleAdd = useCallback(
		(category: keyof StatusShape) => {
			const val = inputs[category].trim();
			if (!val) return;
			onChangeStatus({
				...initialStatus,
				[category]: [...initialStatus[category], val],
			});
			setInputs((s) => ({ ...s, [category]: "" }));
		},
		[inputs, initialStatus, onChangeStatus],
	);

	const handleRemove = useCallback(
		(category: keyof StatusShape, index: number) => {
			onChangeStatus({
				...initialStatus,
				[category]: initialStatus[category].filter((_, i) => i !== index),
			});
		},
		[initialStatus, onChangeStatus],
	);

	const addPrompted = useCallback(
		(category: keyof StatusShape, label: string) => {
			const val = prompt(`Add new status for ${label}:`);
			if (val)
				onChangeStatus({
					...initialStatus,
					[category]: [...initialStatus[category], val],
				});
		},
		[initialStatus, onChangeStatus],
	);

	return { inputs, setInputs, handleAdd, handleRemove, addPrompted } as const;
}
