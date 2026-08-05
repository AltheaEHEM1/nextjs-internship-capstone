import { useState } from "react";
import type {
	AccessRole,
	TeamMember,
} from "@/app/projects/project-settings/page";

export function useProjectSettingsMemberState(initialMembers: TeamMember[]) {
	const [members, setMembers] = useState<TeamMember[]>(initialMembers);
	const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
	const [editMemberRole, setEditMemberRole] = useState("");
	const [editMemberAccess, setEditMemberAccess] =
		useState<AccessRole>("member");

	const handleEditMemberStart = (member: TeamMember) => {
		setEditingMemberId(member.id);
		setEditMemberRole(member.role);
		setEditMemberAccess(member.access);
	};

	const handleEditMemberSave = (id: string) => {
		setMembers((current) =>
			current.map((member) =>
				member.id === id
					? { ...member, role: editMemberRole, access: editMemberAccess }
					: member,
			),
		);
		setEditingMemberId(null);
	};

	const handleDeleteMember = (id: string) => {
		setMembers((current) => current.filter((member) => member.id !== id));
	};

	return {
		members,
		editingMemberId,
		editMemberRole,
		editMemberAccess,
		setEditMemberRole,
		setEditMemberAccess,
		setEditingMemberId,
		handleEditMemberStart,
		handleEditMemberSave,
		handleDeleteMember,
	};
}
