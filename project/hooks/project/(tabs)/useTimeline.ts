import {
	type TimelineItem,
	useTimelineStore,
} from "@/stores/project/(tabs)/TimelineStore";

export type { TimelineItem };

export function useTimeline() {
	const items = useTimelineStore((state) => state.items);
	const options = useTimelineStore((state) => state.options);

	return {
		items,
		options,
	};
}
