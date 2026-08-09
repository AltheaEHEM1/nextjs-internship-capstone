import { useWhiteboardStore } from "@/stores/project/(tabs)/WhiteBoardStore";

export function useWhiteBoard() {
    const persistenceKey = useWhiteboardStore((state) => state.persistenceKey);

    return {
        persistenceKey,
    };
}