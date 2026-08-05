import { useState } from "react";
import type { TeamMemberAssignment } from "@/components/modals/team/AddTeamModal2";

export type Person = {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar: string;
};

export type Team = {
	id: string;
	name: string;
	membersCount: number;
	icon: string;
};

export type TeamFormState = {
	teamName: string;
	teamIcon: string;
	coverUrl: string;
	members: TeamMemberAssignment[];
};

const initialPeople: Person[] = [
	{
		id: "1",
		name: "Alex Mercer",
		email: "alex@srg.tech",
		role: "Frontend Developer",
		avatar: "A",
	},
	{
		id: "2",
		name: "Sarah Jenkins",
		email: "sarah@srg.tech",
		role: "UI/UX Designer",
		avatar: "S",
	},
];

const initialTeams: Team[] = [
	{
		id: "frontend-core",
		name: "Frontend Core Team",
		membersCount: 4,
		icon: "💻",
	},
	{
		id: "backend-infra",
		name: "Backend & DevOps",
		membersCount: 3,
		icon: "⚡",
	},
];

export function useTeamManagement(initialActiveTab: "people" | "teams" = "people") {
	const [activeTab, setActiveTab] = useState<"people" | "teams">(
		initialActiveTab,
	);
	const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
	const [teamStep, setTeamStep] = useState<0 | 1 | 2>(0);
	const [teamData, setTeamData] = useState<TeamFormState>({
		teamName: "",
		teamIcon: "💻",
		coverUrl: "",
		members: [],
	});

	const handleMainAction = () => {
		if (activeTab === "people") {
			setIsAddPeopleOpen(true);
			return;
		}

		setTeamStep(1);
	};

	const closeAddPeopleModal = () => setIsAddPeopleOpen(false);
	const closeTeamModal = () => setTeamStep(0);
	const handleTeamStep1Next = (data: {
		teamName: string;
		teamIcon: string;
		coverUrl: string;
	}) => {
		setTeamData((prev) => ({ ...prev, ...data }));
		setTeamStep(2);
	};
	const handleTeamStep2Back = () => setTeamStep(1);
	const handleTeamStep2Submit = (data: { members: TeamMemberAssignment[] }) => {
		const finalPayload = { ...teamData, ...data };
		console.log("Creating final team payload:", finalPayload);
		setTeamStep(0);
	};

	return {
		activeTab,
		setActiveTab,
		isAddPeopleOpen,
		closeAddPeopleModal,
		teamStep,
		teamData,
		people: initialPeople,
		teams: initialTeams,
		handleMainAction,
		handleTeamStep1Next,
		handleTeamStep2Back,
		handleTeamStep2Submit,
		closeTeamModal,
	};
}
