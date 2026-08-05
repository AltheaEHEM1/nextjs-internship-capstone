import { useState } from "react";

export interface TeamMemberAssignment {
	member: string;
	role: string;
	accessibility: string;
}

export interface UseAddTeamMemberModalParams {
	initialMembers?: TeamMemberAssignment[];
	onSubmit?: (members: TeamMemberAssignment[]) => void;
}

export function useAddTeamMemberModal({
	initialMembers = [],
	onSubmit,
}: UseAddTeamMemberModalParams) {
	const [membersList, setMembersList] =
		useState<TeamMemberAssignment[]>(initialMembers);
	const [currentMember, setCurrentMember] = useState("");
	const [currentRole, setCurrentRole] = useState("Member");
	const [currentAccessibility, setCurrentAccessibility] = useState("member");

	const handleAddToList = () => {
		if (!currentMember) return;
		if (membersList.some((m) => m.member === currentMember)) {
			alert(`${currentMember} is already added to the list.`);
			return;
		}
		setMembersList((prev) => [
			...prev,
			{
				member: currentMember,
				role: currentRole || "Member",
				accessibility: currentAccessibility,
			},
		]);
		setCurrentMember("");
		setCurrentRole("Member");
		setCurrentAccessibility("member");
	};

	const handleRemoveMember = (index: number) => {
		setMembersList((prev) => prev.filter((_, i) => i !== index));
	};

	const handleCreate = () => {
		if (onSubmit) onSubmit(membersList);
		// Caller can close modal after this hook returns
	};

	return {
		membersList,
		setMembersList,
		currentMember,
		setCurrentMember,
		currentRole,
		setCurrentRole,
		currentAccessibility,
		setCurrentAccessibility,
		handleAddToList,
		handleRemoveMember,
		handleCreate,
	};
}
