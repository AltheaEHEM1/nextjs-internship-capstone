"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import AddMemberModal from "@/components/modals/team/AddMemberModal";
import AddTeamModal1 from "@/components/modals/team/AddTeamModal1";
import AddTeamModal2 from "@/components/modals/team/AddTeamModal2";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useTeamManagement } from "@/hooks/team/useTeamManagement";

export default function TeamPage() {
  const {
    activeTab,
    people,
    teams,
    isAddPeopleOpen,
    teamStep,
    handleMainAction,
    closeAddPeopleModal,
    closeTeamModal,
    handleTeamStep1Next,
    handleTeamStep2Back,
    handleTeamStep2Submit,
  } = useTeamManagement("people");

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

      {activeTab === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link key={team.id} href={`/team/${team.id}`}>
              <div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 hover:border-blue_munsell-400 transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-platinum-100 text-lg dark:bg-payne's_gray-500">
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

      <AddMemberModal opened={isAddPeopleOpen} onClose={closeAddPeopleModal} />
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
    </div>
  );
}