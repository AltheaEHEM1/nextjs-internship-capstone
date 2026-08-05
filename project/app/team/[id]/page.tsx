"use client";

import {
	Archive,
	ArrowLeft,
	LogOut,
	MoreHorizontal,
	Trash2,
	UserPlus,
} from "lucide-react";
import Link from "next/link";
import AddTeamMemberModal from "@/components/modals/team/AddTeamMemberModal";
import { useTeamStore } from "@/stores/team/team-store";

export default function SpecificTeam() {
	const {
		team,
		isMenuOpen,
		isAddMemberOpen,
		toggleMenu,
		openAddMemberModal,
		closeAddMemberModal,
	} = useTeamStore();

	return (
		<div className="space-y-6 pb-12">
			<div className="flex items-center">
				<Link
					href="/team"
					className="inline-flex items-center gap-2 rounded-xl border border-french_gray-200 bg-white px-3 py-2 text-sm font-medium text-outer_space-700 shadow-xs transition-colors hover:bg-platinum-100 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-outer_space-400"
				>
					<ArrowLeft size={16} />
					Back to Teams
				</Link>
			</div>

			{/* Cover Picture & Info Header */}
			<div className="relative rounded-2xl border border-french_gray-200 bg-white shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
				<div
					className="h-40 w-full bg-cover bg-center rounded-t-2xl overflow-hidden"
					style={{ backgroundImage: `url(${team.coverUrl})` }}
				/>

				<div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
					<div className="flex items-center gap-4 -mt-12 sm:-mt-14">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-outer_space-400 text-4xl shadow-md border-4 border-white dark:border-outer_space-500">
							{team.icon}
						</div>
						<div className="pt-2 sm:pt-4">
							<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
								{team.name}
							</h2>
							<p className="text-xs text-outer_space-400 dark:text-platinum-400">
								{team.members.length} Members
							</p>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={openAddMemberModal}
							className="inline-flex items-center gap-1.5 rounded-xl bg-blue_munsell-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue_munsell-600 transition-colors"
						>
							<UserPlus size={15} />
							Add Team Members
						</button>

						<div className="relative">
							<button
								type="button"
								onClick={toggleMenu}
								className="rounded-xl border border-french_gray-200 p-2 text-outer_space-500 hover:bg-platinum-100 dark:border-payne's_gray-600 dark:text-platinum-300 dark:hover:bg-outer_space-400 transition-colors"
							>
								<MoreHorizontal size={18} />
							</button>

							{/* Dropdown Menu */}
							{isMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg py-1 z-10">
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
									>
										Edit Team
									</button>
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
									>
										Delete Team
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* List of Members */}
			<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 space-y-4">
				<h3 className="text-base font-bold text-outer_space-800 dark:text-platinum-100">
					Team Members
				</h3>
				<div className="divide-y divide-french_gray-100 dark:divide-payne's_gray-600">
					{team.members.map((m) => (
						<div
							key={m.id}
							className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue_munsell-500 font-semibold text-white text-xs">
									{m.avatar}
								</div>
								<div>
									<h4 className="font-semibold text-outer_space-800 dark:text-platinum-100 text-xs">
										{m.name}
									</h4>
									<p className="text-[11px] text-outer_space-400 dark:text-platinum-400">
										{m.role}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<AddTeamMemberModal
				opened={isAddMemberOpen}
				onClose={closeAddMemberModal}
			/>
		</div>
	);
}
