"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import AddMemberModal from "@/components/modals/team/AddMemberModal";
import AddTeamModal1 from "@/components/modals/team/AddTeamModal1";
import AddTeamModal2 from "@/components/modals/team/AddTeamModal2";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useTeamManagement } from "@/hooks/team/useTeamManagement";

interface Person {
	id: string | number;
	name: string;
	email: string;
	avatar: string;
}

interface TeamItem {
	id: string | number;
	name: string;
	icon: string;
	membersCount: number;
}

export default function Team() {
	const {
		activeTab,
		people,
		teams,
		isAddPeopleOpen,
		teamStep,
		teamName,
		teamIcon,
		coverUrl,
		handleMainAction,
		closeAddPeopleModal,
		closeTeamModal,
		handleTeamStep1Next,
		handleTeamStep2Back,
		handleTeamStep2Submit,
	} = useTeamManagement("teams");

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

			{activeTab === "people" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{people.map((person: Person) => (
						<div
							key={person.id}
							className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500"
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
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{activeTab === "teams" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{teams.map((team: TeamItem) => (
						<Link key={team.id} href={`/team/${team.id}`}>
							<div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 hover:border-blue_munsell-400 transition-all cursor-pointer">
								<div className="flex items-center gap-3">
									<span className="text-2xl">{team.icon}</span>
									<div>
										<h4 className="font-semibold text-outer_space-800 dark:text-platinum-100 text-sm">
											{team.name}
										</h4>
										<p className="text-xs text-outer_space-400 dark:text-platinum-400">
											{team.membersCount} active members
										</p>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			<AddMemberModal opened={isAddPeopleOpen} onClose={closeAddPeopleModal} />

			{/* Step 1 Modal */}
			<AddTeamModal1
				opened={teamStep === 1}
				onClose={closeTeamModal}
				onNext={handleTeamStep1Next}
				initialData={{ teamName, teamIcon, coverUrl }}
			/>

			{/* Step 2 Modal */}
			<AddTeamModal2
				opened={teamStep === 2}
				onClose={closeTeamModal}
				onBack={handleTeamStep2Back}
				onSubmit={handleTeamStep2Submit}
			/>
		</div>
	);
}
