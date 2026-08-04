"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AddMemberModal from "@/components/modals/team/AddMemberModal";
import AddTeamModal1 from "@/components/modals/team/AddTeamModal1";
import { PageHeader } from "@/components/page-header/PageHeader";

// Types
type Person = {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar: string;
};
type Team = { id: string; name: string; membersCount: number; icon: string };

export default function TeamPage() {
	const [activeTab, _setActiveTab] = useState<"people" | "teams">("people");

	// Modal states
	const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
	const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

	// Form states
	const [_personInput, _setPersonInput] = useState("");
	const [_personNotes, _setPersonNotes] = useState("");
	const [_teamName, _setTeamName] = useState("");

	// Mock Data
	const people: Person[] = [
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

	const teams: Team[] = [
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

	const handleMainAction = () => {
		if (activeTab === "people") {
			setIsAddPeopleOpen(true);
		} else {
			setIsCreateTeamOpen(true);
		}
	};

	return (
		<div className="space-y-6 pb-12">
			{/* Header with Dynamic Button */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<PageHeader
					title="Team Management"
					description="Manage organization members, collaborators, and internal sub-teams."
				/>
				<button
					type="button"
					onClick={handleMainAction}
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue_munsell-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue_munsell-600 transition-colors"
				>
					<Plus size={18} />
					{activeTab === "people" ? "Add People" : "Create Team"}
				</button>
			</div>

			{/* Tab Content: People */}
			{activeTab === "people" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{people.map((person) => (
						<div
							key={person.id}
							className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 flex items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue_munsell-500 font-bold text-white text-sm">
									{person.avatar}
								</div>
								<div>
									<h4 className="font-semibold text-outer_space-800 dark:text-platinum-100 text-sm">
										{person.name}
									</h4>
									<p className="text-xs text-outer_space-400 dark:text-platinum-400">
										{person.email}
									</p>
									<span className="inline-block mt-1 rounded bg-platinum-100 px-1.5 py-0.5 text-[10px] text-outer_space-600 dark:bg-payne's_gray-500 dark:text-platinum-300">
										{person.role}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Tab Content: Teams */}
			{activeTab === "teams" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{teams.map((team) => (
						<div
							key={team.id}
							className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 flex items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-platinum-100 text-lg dark:bg-payne's_gray-500">
									{team.icon}
								</div>
								<div>
									<h4 className="font-semibold text-outer_space-800 dark:text-platinum-100 text-sm">
										{team.name}
									</h4>
									<p className="text-xs text-outer_space-400 dark:text-platinum-400 mt-0.5">
										{team.membersCount} members
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<AddMemberModal
				opened={isAddPeopleOpen}
				onClose={() => setIsAddPeopleOpen(false)}
			/>
			<AddTeamModal1
				opened={isCreateTeamOpen}
				onClose={() => setIsCreateTeamOpen(false)}
				onNext={() => {
					setIsCreateTeamOpen(false);
				}}
			/>
		</div>
	);
}
