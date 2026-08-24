"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/dropdown/select";
import AddMemberModal from "@/components/modals/team/AddMemberModal";
import AddTeamModal1 from "@/components/modals/team/AddTeamModal1";
import AddTeamModal2 from "@/components/modals/team/AddTeamModal2";
import { PageHeader } from "@/components/page-header/PageHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";
import { useTeamManagement } from "@/hooks/team/useTeamManagement";
import type { PersonItem, TeamItem } from "@/stores/team/TeamStore";

export function TeamPageContent({
	initialTab,
}: {
	initialTab: "people" | "teams";
}) {
	const {
		activeTab,
		people = [],
		teams = [],
		isAddPeopleOpen,
		isTeamModalOpen,
		teamStep,
		handleMainAction,
		closeAddPeopleModal,
		closeTeamModal,
		handleTeamStep1Next,
		handleTeamStep2Back,
		handleTeamStep2Submit,
	} = useTeamManagement(initialTab);

	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [peopleSearchQuery, setPeopleSearchQuery] = useState("");
	const [teamFilter, setTeamFilter] = useState<"all" | "owner">("all");
	const [teamSearchQuery, setTeamSearchQuery] = useState("");

	const filteredPeople = people
		.filter((p, index, self) => index === self.findIndex((t) => t.id === p.id))
		.filter((p) => {
			const matchesRole =
				roleFilter === "all" ||
				(p.role && p.role.toLowerCase() === roleFilter.toLowerCase());
			const query = peopleSearchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				p.name.toLowerCase().includes(query) ||
				p.email.toLowerCase().includes(query);
			return matchesRole && matchesSearch;
		});

	const filteredTeams = teams
		.filter(
			(t, index, self) => index === self.findIndex((tm) => tm.id === t.id),
		)
		.filter((t) => {
			const matchesFilter =
				teamFilter === "all" || t.permission === "administrator";
			const query = teamSearchQuery.trim().toLowerCase();
			const matchesSearch = !query || t.name.toLowerCase().includes(query);
			return matchesFilter && matchesSearch;
		});

	return (
		<div className="space-y-6 pb-12">
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
				<div className="space-y-6">
					{/* Filters Section */}
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-3">
							<Select value={roleFilter} onValueChange={setRoleFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Roles</SelectItem>
									<SelectItem value="administrator">Administrator</SelectItem>
									<SelectItem value="member">Member</SelectItem>
									<SelectItem value="viewer">Viewer</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="ml-auto">
							<SearchBar
								value={peopleSearchQuery}
								onChange={setPeopleSearchQuery}
								placeholder="Search members..."
							/>
						</div>
					</div>

					{filteredPeople.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-french_gray-200 p-12 text-center dark:border-paynes_gray-600">
							<p className="text-sm text-outer_space-500 dark:text-platinum-400">
								No members found for the selected filter.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredPeople.map((person: PersonItem) => (
								<Link key={person.id} href={`/team/person/${person.id}`}>
									<div className="group flex cursor-pointer items-center justify-between rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-blue_munsell-400 hover:shadow-md hover:-translate-y-0.5 dark:border-paynes_gray-600 dark:bg-outer_space-500">
										<div className="flex min-w-0 items-center gap-4">
											<div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue_munsell-500 text-xs font-bold text-white shadow-sm">
												{person.avatar &&
												(person.avatar.startsWith("http") ||
													person.avatar.startsWith("data:")) ? (
													<Image
														src={person.avatar}
														alt={person.name}
														width={44}
														height={44}
														className="h-full w-full object-cover"
														unoptimized
													/>
												) : person.avatar && person.avatar.length <= 3 ? (
													person.avatar
												) : (
													person.name
														?.split(" ")
														.map((n) => n[0])
														.join("")
														.substring(0, 2)
														.toUpperCase() || "U"
												)}
											</div>
											<div className="min-w-0">
												<h4 className="truncate text-sm font-semibold text-outer_space-800 transition-colors group-hover:text-blue_munsell-600 dark:text-platinum-100 dark:group-hover:text-blue_munsell-400">
													{person.name}
												</h4>
												<p className="mt-0.5 truncate text-xs text-outer_space-400 dark:text-platinum-400">
													{person.email}
												</p>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			)}

			{activeTab === "teams" && (
				<div className="space-y-6">
					{/* Filters Section */}
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-3">
							<Select
								value={teamFilter}
								onValueChange={(val) => setTeamFilter(val as "all" | "owner")}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Teams</SelectItem>
									<SelectItem value="owner">Owned Teams</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="ml-auto">
							<SearchBar
								value={teamSearchQuery}
								onChange={setTeamSearchQuery}
								placeholder="Search teams..."
							/>
						</div>
					</div>

					{filteredTeams.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-french_gray-200 p-12 text-center dark:border-paynes_gray-600">
							<p className="text-sm text-outer_space-500 dark:text-platinum-400">
								No teams found for the selected filter.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredTeams.map((team: TeamItem) => (
								<Link key={team.id} href={`/team/team/${team.id}`}>
									<div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500 hover:border-blue_munsell-400 transition-all cursor-pointer flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-platinum-100 text-lg dark:bg-paynes_gray-500">
												{team.icon}
											</div>
											<div>
												<h4 className="font-semibold text-outer_space-800 dark:text-platinum-100 text-sm">
													{team.name}
												</h4>
												<p className="text-xs text-outer_space-400 dark:text-platinum-400 mt-0.5">
													{team.membersCount} active members
												</p>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			)}

			{isAddPeopleOpen && (
				<AddMemberModal
					opened={isAddPeopleOpen}
					onClose={closeAddPeopleModal}
				/>
			)}
			{isTeamModalOpen && (
				<>
					<AddTeamModal1
						opened={teamStep === 1}
						onClose={closeTeamModal}
						onNext={handleTeamStep1Next}
					/>
					<AddTeamModal2
						opened={teamStep === 2}
						onClose={closeTeamModal}
						onBack={handleTeamStep2Back}
						onSubmit={handleTeamStep2Submit}
					/>
				</>
			)}
		</div>
	);
}

function TeamPageWithParams() {
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab") as "people" | "teams" | null;
	return <TeamPageContent initialTab={tab || "people"} />;
}

export default function TeamPage() {
	return (
		<Suspense
			fallback={
				<div className="p-6 md:p-10 space-y-6">
					<div className="space-y-2 mb-8">
						<div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
						<div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
					</div>
					<CardGridSkeleton count={6} />
				</div>
			}
		>
			<TeamPageWithParams />
		</Suspense>
	);
}
