import {
	type ColumnDef,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useListStore } from "@/stores/project/(tabs)/ListStore";

export interface Task {
	id: string;
	title: string;
	status: "Todo" | "In Progress" | "In Review" | "Done";
	priority: "Low" | "Medium" | "High" | "Critical";
	assignee: string;
	dueDate: string;
	estimate: string;
}

export function useList(columns: ColumnDef<Task>[]) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const tasks = useListStore((state) => state.tasks);
	const setTasks = useListStore((state) => state.setTasks);

	const table = useReactTable<Task>({
		data: tasks,
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
