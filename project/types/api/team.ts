/**
 * API request/response types for Team routes.
 */
import type { TeamPermission } from "../domain/team";

// POST /api/team/create
export interface CreateTeamRequest {
	name: string;
	icon?: string;
	coverUrl?: string;
	members: Array<{
		userId: string;
		role: string;
		permission: TeamPermission;
	}>;
}

// PATCH /api/team/[teamId]
export interface UpdateTeamRequest {
	name: string;
	icon: string;
	coverUrl?: string;
}

// POST /api/team/[teamId]/members
export interface AddTeamMemberRequest {
	userId?: string;
	email?: string;
	role?: string;
	permission?: TeamPermission;
}

// PATCH /api/team/[teamId]/members/[userId]
export interface UpdateTeamMemberRequest {
	role?: string;
	permission?: TeamPermission;
}
