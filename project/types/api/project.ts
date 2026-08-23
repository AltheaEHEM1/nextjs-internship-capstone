/**
 * API request/response types for Project routes.
 */

// POST /api/project/create
export interface CreateProjectRequest {
	name: string;
	description?: string;
	teamId: string;
	dueDate: string;
	views: string[];
	statuses?: {
		notStarted?: string[];
		active?: string[];
		done?: string[];
		closed?: string[];
	};
}

// GET /api/project/check-name?name=...

// PATCH /api/project/[id]/settings
export interface UpdateProjectSettingsRequest {
	name: string;
	description: string;
	teamId: string;
	statuses?: Array<{
		id?: string;
		name: string;
		description: string;
		color: string;
	}>;
}

// POST /api/project/[id]/statuses/reorder
export interface ReorderStatusesRequest {
	statuses: Array<{ id: string; position: number }>;
}
