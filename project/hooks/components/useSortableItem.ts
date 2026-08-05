import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UseSortableItemParams {
	id: string;
	data?: Record<string, unknown>;
}

/**
 * Thin wrapper around dnd-kit's `useSortable` that normalises the
 * return value to `{ setNodeRef, attributes, listeners, isDragging, style }`.
 */
export function useSortableItem({ id, data }: UseSortableItemParams) {
	const {
		setNodeRef,
		attributes,
		listeners,
		isDragging,
		transform,
		transition,
	} = useSortable({ id, data });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return { setNodeRef, attributes, listeners, isDragging, style };
}
