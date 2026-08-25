import {
	type ColumnDef,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useGlobalSearchStore } from "@/stores/global/GlobalSearchStore";
import { useListStore } from "@/stores/project/(tabs)/ListStore";

export interface Task {
	id: string;
	title: string;
	status: "Todo" | "In Progress" | "In Review" | "Done";
	priority: "Low" | "Medium" | "High" | "Critical";
	assignee: string;
	dueDate: string;
}

export function useList(columns: ColumnDef<Task>[]) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const tasks = useListStore((state) => state.tasks);
	const setTasks = useListStore((state) => state.setTasks);
	const searchQuery = useGlobalSearchStore((state) => state.searchQuery);

	const filteredTasks = useMemo(() => {
		if (!searchQuery.trim()) return tasks;
		const q = searchQuery.toLowerCase().trim();
		return tasks.filter(
			(t) =>
				t.title.toLowerCase().includes(q) ||
				t.status.toLowerCase().includes(q) ||
				t.assignee.toLowerCase().includes(q),
		);
	}, [tasks, searchQuery]);

	const table = useReactTable<Task>({
		data: filteredTasks,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return {
		table,
		tasks,
		setTasks,
	};
}
