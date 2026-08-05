"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function useSortableItem({ id, data }: { id: string; data?: any }) {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
		style,
	};
}
