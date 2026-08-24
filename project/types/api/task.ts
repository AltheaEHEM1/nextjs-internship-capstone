/**
 * API request/response types for Task routes.
 */
import type { TaskPriority } from "../domain/task";

// POST /api/task/create
export interface CreateTaskRequest {
	title: string;
	description?: string;
	statusId: string;
	assigneeId?: string;
	priority?: TaskPriority;
	startDate?: string;
	dueDate?: string;
	projectId: string;
	labelName?: string;
}

// PATCH /api/task/[id]
export interface UpdateTaskRequest {
	title?: string;
	description?: string;
	statusId?: string;
	assigneeId?: string;
	priority?: TaskPriority;
	startDate?: string;
	dueDate?: string;
	label?: string;
	projectId: string;
}

// DELETE /api/task/[id]
export interface DeleteTaskRequest {
	projectId: string;
}

// POST /api/task/[id]/comments
export interface CreateCommentRequest {
	content: string;
	projectId: string;
}

// POST /api/task/reorder
export interface ReorderTasksRequest {
	tasks: Array<{ id: string; statusId: string; position: number }>;
	projectId: string;
}
