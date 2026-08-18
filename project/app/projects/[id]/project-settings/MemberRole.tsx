"use client";
import { useState } from "react";
import { Mail, Shield, User } from "lucide-react";
import ConfirmDialog from "@/components/modals/team/ConfirmDialog";
import { useProjectSettings } from "@/hooks/project/project-settings/useProjectSettings";
import { getTeamDetailAction } from "@/actions/team/Team";
import type { AccessRole, TeamMember } from "@/stores/project/project-settings/ProjectSettingsStore";

interface MemberRoleProps {
	members: TeamMember[];
}

export default function MemberRole({ members }: MemberRoleProps) {
	const { team, teamId, availableTeams, setTeamId, setTeam, setMembers } = useProjectSettings();
	const [pendingTeamId, setPendingTeamId] = useState<string | null>(null);

	const getAccessBadgeStyle = (access: AccessRole) => {
		switch (access) {
			case "administrator":
				return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
			case "member":
				return "bg-blue_munsell-500/15 text-blue_munsell-600 dark:text-blue_munsell-400 border-blue_munsell-500/30";
			case "viewer":
				return "bg-french_gray-200/60 text-outer_space-600 dark:bg-payne's_gray-800 dark:text-platinum-400 border-french_gray-300 dark:border-payne's_gray-700";
		}
	};

	return (
		<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-5 flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b border-french_gray-100 dark:border-payne's_gray-800">
				<div className="space-y-0.5">
					<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider flex items-center gap-2">
						<User size={16} className="text-blue_munsell-500" />
						Team Member
					</h2>
				</div>
				<div className="flex items-center gap-3">
					{team && (
						<div className="flex items-center gap-2 border-r border-french_gray-200 dark:border-payne's_gray-700 pr-3">
							<select
								value={teamId}
								onChange={(e) => {
									const newTeamId = e.target.value;
									if (newTeamId !== teamId) {
										setPendingTeamId(newTeamId);
									}
								}}
								className="px-2 py-0.5 rounded-md bg-blue_munsell-50 dark:bg-blue_munsell-500/10 text-xs font-bold text-blue_munsell-600 dark:text-blue_munsell-400 border border-blue_munsell-100 dark:border-blue_munsell-500/20 focus:outline-hidden cursor-pointer hover:bg-blue_munsell-100 transition-colors capitalize"
							>
								{availableTeams.map((t) => (
									<option key={t.id} value={t.id}>
										{t.name}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			</div>
			{/* Alert Popup */}
			<ConfirmDialog
				opened={pendingTeamId !== null}
				onClose={() => setPendingTeamId(null)}
				onConfirm={async () => {
					if (!pendingTeamId) return;
					const newTeamId = pendingTeamId;
					const selected = availableTeams.find((t) => t.id === newTeamId);
					if (selected) {
						setTeamId(newTeamId);
						setTeam(selected.name);

						const res = await getTeamDetailAction(newTeamId);
						if (res.success && res.data?.members) {
							const newMembers: TeamMember[] = res.data.members.map((m: any) => ({
								id: m.id,
								name: m.name || "Unknown",
								email: m.email || "",
								role: m.role || "Member",
								access: (m.permission as AccessRole) || "member",
							}));
							setMembers(newMembers);
						}
					}
					setPendingTeamId(null);
				}}
				title="Change Team?"
				description="Are you sure you want to change the project's team? If you do, all assigned tasks to the current members will be gone."
				confirmLabel="Confirm Change"
				variant="danger"
			/>
			{/* Members List */}
			<div className="divide-y divide-french_gray-100 dark:divide-payne's_gray-800">
				{members.length === 0 ? (
					<div className="py-8 text-center text-outer_space-500 dark:text-platinum-400">
						<p className="text-sm">No members assigned to this project yet.</p>
					</div>
				) : (
					members.map((member) => (
						<div
							key={member.id}
							className="py-3.5 px-3 -mx-3 rounded-xl transition-colors hover:bg-french_gray-50/60 dark:hover:bg-outer_space-800/50"
						>
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
								{/* Member Info */}
								<div className="flex items-start gap-3">
									<div className="w-9 h-9 rounded-xl bg-blue_munsell-500/15 text-blue_munsell-600 dark:text-blue_munsell-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue_munsell-500/20">
										{member.name.charAt(0)}
									</div>
									<div className="space-y-1">
										<p className="text-sm font-semibold text-outer_space-900 dark:text-platinum-100 leading-tight">
											{member.name}
										</p>
										<p className="text-xs text-outer_space-500 dark:text-platinum-400 flex items-center gap-1">
											<Mail size={11} className="opacity-70" />
											{member.email}
										</p>
									</div>
								</div>
								{/* View State */}
								<div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
									<div className="text-left md:text-right space-y-1">
										<span className="inline-block text-xs font-semibold text-outer_space-800 dark:text-platinum-200 bg-french_gray-100 dark:bg-payne's_gray-800 px-2.5 py-1 rounded-lg border border-french_gray-200 dark:border-payne's_gray-700">
											{member.role}
										</span>
										<div>
											<span
												className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-1 ${getAccessBadgeStyle(
													member.access
												)}`}
											>
												<Shield size={10} /> {member.access}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
