import { useMemo } from "react";
import { ViewMode, type Task } from "gantt-task-react";
import { useGanttStore } from "@/stores/project/(tabs)/GanttStore";

export interface GanttViewModeOption {
    mode: ViewMode;
    label: string;
}

export function useGanttChart() {
    const viewMode = useGanttStore((state) => state.viewMode);
    const setViewMode = useGanttStore((state) => state.setViewMode);
    const tasks = useGanttStore((state) => state.tasks);
    const setTasks = useGanttStore((state) => state.setTasks);
    const handleTaskChange = useGanttStore((state) => state.handleTaskChange);
    const handleTaskDelete = useGanttStore((state) => state.handleTaskDelete);
    const handleProgressChange = useGanttStore((state) => state.handleProgressChange);

    const viewModeOptions: GanttViewModeOption[] = useMemo(
        () => [
            { mode: ViewMode.Day, label: "Day" },
            { mode: ViewMode.Week, label: "Week" },
            { mode: ViewMode.Month, label: "Month" },
        ],
        []
    );

    const columnWidth = useMemo(() => {
        if (viewMode === ViewMode.Month) return 150;
        if (viewMode === ViewMode.Week) return 250;
        return 65;
    }, [viewMode]);

    return {
        tasks,
        viewMode,
        columnWidth,
        viewModeOptions,
        setViewMode,
        setTasks,
        handleTaskChange,
        handleTaskDelete,
        handleProgressChange,
    };
}