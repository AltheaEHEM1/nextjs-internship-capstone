"use client";

import { AlertCircle, ArrowLeft, MoreHorizontal, Pencil, Trash2, UserPlus,} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteTeamAction, getTeamDetailAction } from "@/actions/team/Team";
import { removeTeamMemberAction, updateTeamMemberAction,} from "@/actions/team/TeamMember";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/alert";
import { AddTeamMemberModal } from "@/components/modals/team/AddTeamMemberModal";
import { useToast } from "@/hooks/toast/use-toast";
import { useBreadcrumbStore } from "@/stores/components/breadcrumb-store";
import { useTeamStore } from "@/stores/team/useTeamStore";

export default function SpecificTeam() {
	const params = useParams();
	const router = useRouter();
	const teamId = params.id as string;

	const teamDetail = useTeamStore((s) => s.teamDetail);
	const setTeamDetail = useTeamStore((s) => s.setTeamDetail);
	const isMenuOpen = useTeamStore((s) => s.isMenuOpen);
	const isAddMemberOpen = useTeamStore((s) => s.isAddMemberOpen);
	const toggleMenu = useTeamStore((s) => s.toggleMenu);
	const openAddMemberModal = useTeamStore((s) => s.openAddMemberModal);
	const closeAddMemberModal = useTeamStore((s) => s.closeAddMemberModal);
	const setBreadcrumbMapping = useBreadcrumbStore((s) => s.setMapping);
	const { toast } = useToast();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleDeleteTeam = async () => {
		if (confirm("Are you sure you want to delete this team?")) {
			const res = await deleteTeamAction(teamId);
			if (res.success) {
				toast({
					title: "Team deleted",
					description: "The team has been successfully deleted.",
				});
				router.push("/team");
			} else {
				toast({
					title: "Error",
					description: res.error || "Failed to delete team.",
					variant: "destructive",
				});
			}
		}
	};

	const handleDeleteMember = async (userId: string) => {
		if (confirm("Are you sure you want to remove this member?")) {
			const res = await removeTeamMemberAction(teamId, userId);
			if (res.success) {
				toast({
					title: "Member removed",
					description: "The member has been successfully removed.",
				});
				router.refresh();
			} else {
				toast({
					title: "Error",
					description: res.error || "Failed to remove member.",
					variant: "destructive",
				});
			}
		}
	};

	const handleEditMember = async (userId: string, currentRole: string) => {
		const newRole = prompt("Enter new role:", currentRole);
		if (newRole && newRole !== currentRole) {
			const res = await updateTeamMemberAction({
				teamId,
				userId,
				role: newRole,
			});
			if (res.success) {
				toast({
					title: "Role updated",
					description: "The member's role has been successfully updated.",
				});
				router.refresh();
			} else {
				toast({
					title: "Error",
					description: res.error || "Failed to update member role.",
					variant: "destructive",
				});
			}
		}
	};

	// Fetch the team + its members from the DB whenever the id changes.
	// Without this, `teamDetail` in the store never gets populated and
	// the page falls through to `return null` forever.
	useEffect(() => {
		let cancelled = false;

		async function loadTeamDetail() {
			setLoading(true);
			setError(null);
			const res = await getTeamDetailAction(teamId);
			if (cancelled) return;

			if (res.success && res.data) {
				setTeamDetail(res.data as any);
				setBreadcrumbMapping(teamId, (res.data as any).name);
			} else {
				setError(res.error ?? "Failed to load team.");
				setTeamDetail(null);
			}
			setLoading(false);
		}

		if (teamId) loadTeamDetail();

		return () => {
			cancelled = true;
		};
	}, [teamId, setTeamDetail, setBreadcrumbMapping]);

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
				<Link
					href="/team"
					className="inline-flex items-center gap-2 rounded-xl border border-french_gray-200 bg-white px-3 py-2 text-sm font-medium text-outer_space-700 shadow-xs transition-colors hover:bg-platinum-100 dark:border-paynes_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-outer_space-400"
				>
					<ArrowLeft size={16} />
					Back to Teams
				</Link>
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error ?? "Team not found."}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-12">
			<div className="flex items-center">
				<Link
					href="/team"
					className="inline-flex items-center gap-2 rounded-xl border border-french_gray-200 bg-white px-3 py-2 text-sm font-medium text-outer_space-700 shadow-xs transition-colors hover:bg-platinum-100 dark:border-paynes_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-outer_space-400"
				>
					<ArrowLeft size={16} />
					Back to Teams
				</Link>
			</div>

			<div className="relative rounded-2xl border border-french_gray-200 bg-white shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500">
				<div
					className="h-40 w-full bg-cover bg-center rounded-t-2xl overflow-hidden"
					style={{ backgroundImage: `url(${teamDetail.coverUrl})` }}
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
										className="flex w-full items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
									>
										Edit Team
									</button>
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
								<button
									type="button"
									onClick={() => handleEditMember(m.userId, m.role || "Member")}
									className="p-1.5 text-outer_space-400 hover:text-blue_munsell-500 hover:bg-blue_munsell-50 dark:hover:bg-outer_space-600 rounded-md transition-colors"
									title="Edit Member Role"
								>
									<Pencil size={14} />
								</button>
								<button
									type="button"
									onClick={() => handleDeleteMember(m.userId)}
									className="p-1.5 text-outer_space-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
									title="Remove Member"
								>
									<Trash2 size={14} />
								</button>
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
		</div>
	);
}
