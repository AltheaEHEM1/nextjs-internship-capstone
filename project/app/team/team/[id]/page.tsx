"use client";

import { AlertCircle, ArrowLeft, MoreHorizontal, Pencil, Trash2, UserPlus, } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/alert";
import ConfirmDialog from "@/components/modals/team/ConfirmDialog";
import EditRoleModal from "@/components/modals/team/EditRoleModal";
import { AddTeamMemberModal } from "@/components/modals/team/AddTeamMemberModal";
import { useTeamDetailManagement } from "@/hooks/team/useTeamManagement";

export default function SpecificTeam() {
	const params = useParams();
	const router = useRouter();
	const teamId = params.id as string;

	const {
		teamDetail,
		loading,
		error,
		confirmState,
		editRoleState,
		isMenuOpen,
		isAddMemberOpen,
		toggleMenu,
		openAddMemberModal,
		closeAddMemberModal,
		closeConfirm,
		closeEditRole,
		handleDeleteTeam,
		handleDeleteMember,
		handleEditMemberClick,
		submitEditRole,
	} = useTeamDetailManagement(teamId);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-sm text-outer_space-500 dark:text-platinum-300">
					Loading team...
				</p>
			</div>
		);
	}

	if (error || !teamDetail) {
		return (
			<div className="space-y-6 pb-12">
				<button
					type="button"
					onClick={() => router.back()}
					className="inline-flex items-center gap-2 text-sm font-medium text-outer_space-700 dark:text-platinum-300 hover:text-outer_space-900 dark:hover:text-platinum-100 transition-all hover:scale-105"
				>
					<ArrowLeft size={16} />
					Back
				</button>
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error ?? "Team not found."}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center">
				<button
					type="button"
					onClick={() => router.back()}
					className="inline-flex items-center gap-2 text-sm font-medium text-outer_space-700 dark:text-platinum-300 hover:text-outer_space-900 dark:hover:text-platinum-100 transition-all hover:scale-105"
				>
					<ArrowLeft size={16} />
					Back
				</button>
			</div>

			<div className="relative rounded-2xl border border-french_gray-200 bg-white shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500">
				<div
					className={`h-40 w-full bg-cover bg-center rounded-t-2xl overflow-hidden ${!teamDetail.coverUrl ? 'bg-gradient-to-r from-blue_munsell-400 via-blue_munsell-500 to-indigo-500' : ''}`}
					style={teamDetail.coverUrl ? { backgroundImage: `url(${teamDetail.coverUrl})` } : {}}
				/>
				<div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
					<div className="flex items-center gap-4 -mt-12 sm:-mt-14">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-outer_space-400 text-4xl shadow-md border-4 border-white dark:border-outer_space-500">
							{teamDetail.icon}
						</div>
						<div className="pt-2 sm:pt-4">
							<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
								{teamDetail.name}
							</h2>
							<p className="text-xs text-outer_space-400 dark:text-platinum-400">
								{teamDetail.members?.length ?? 0} Members
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={openAddMemberModal}
							className="inline-flex items-center gap-1.5 rounded-xl bg-blue_munsell-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue_munsell-600 transition-colors cursor-pointer"
						>
							<UserPlus size={15} />
							Add Team Members
						</button>
						<div className="relative">
							<button
								type="button"
								onClick={toggleMenu}
								className="rounded-xl border border-french_gray-200 p-2 text-outer_space-500 hover:bg-platinum-100 dark:border-paynes_gray-600 dark:text-platinum-300 dark:hover:bg-outer_space-400 transition-colors cursor-pointer"
							>
								<MoreHorizontal size={18} />
							</button>
							{isMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg py-1 z-10">
									<button
										type="button"
										onClick={handleDeleteTeam}
										className="flex w-full items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
									>
										Delete Team
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500 space-y-4">
				<h3 className="text-base font-bold text-outer_space-800 dark:text-platinum-100">
					Team Members
				</h3>
				<div className="divide-y divide-french_gray-100 dark:divide-paynes_gray-600">
					{teamDetail.members?.map((m) => (
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
							<div className="flex items-center gap-2">
								{m.role !== "Owner" && (
									<>
										<button
											type="button"
											onClick={() => handleEditMemberClick(m.userId, m.name, m.role || "Member", m.permission || "member")}
											className="p-1.5 text-outer_space-400 hover:text-blue_munsell-500 hover:bg-blue_munsell-50 dark:hover:bg-outer_space-600 rounded-md transition-colors"
											title="Edit Member Role"
										>
											<Pencil size={14} />
										</button>
										<button
											type="button"
											onClick={() => handleDeleteMember(m.userId, m.name)}
											className="p-1.5 text-outer_space-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
											title="Remove Member"
										>
											<Trash2 size={14} />
										</button>
									</>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<AddTeamMemberModal
				teamId={teamDetail.id}
				isOpen={isAddMemberOpen}
				onClose={closeAddMemberModal}
			/>

			<ConfirmDialog
				opened={confirmState.opened}
				onClose={closeConfirm}
				onConfirm={confirmState.onConfirm}
				title={confirmState.title}
				description={confirmState.description}
				confirmLabel={confirmState.confirmLabel}
				variant="danger"
				loading={confirmState.loading}
			/>

			<EditRoleModal
				opened={editRoleState.opened}
				memberName={editRoleState.memberName}
				currentRole={editRoleState.currentRole}
				currentPermission={editRoleState.currentPermission}
				loading={editRoleState.loading}
				onClose={closeEditRole}
				onSubmit={submitEditRole}
			/>
		</div>
	);
}
