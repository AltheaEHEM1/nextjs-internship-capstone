"use client";
import { Award, Check, Edit, Mail, Shield, Trash2, User, X } from "lucide-react";
import { useMemberRoleState } from "@/hooks/project/project-settings/useProjectSettings";
import type { AccessRole, TeamMember } from "./page";

interface MemberRoleProps {
	members: TeamMember[];
	editingMemberId: string | null;
	editMemberRole: string;
	editMemberAccess: AccessRole;
	setEditMemberRole: (role: string) => void;
	setEditMemberAccess: (access: AccessRole) => void;
	handleEditMemberSave: (id: string) => void;
	setEditingMemberId: (id: string | null) => void;
	handleEditMemberStart: (member: TeamMember) => void;
	handleDeleteMember: (id: string) => void;
}

export default function MemberRole({
	members,
	editingMemberId,
	editMemberRole,
	editMemberAccess,
	setEditMemberRole,
	setEditMemberAccess,
	handleEditMemberSave,
	setEditingMemberId,
	handleEditMemberStart,
	handleDeleteMember,
}: MemberRoleProps) {
	const { confirmDeleteId, setConfirmDeleteId } = useMemberRoleState();

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
		<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b border-french_gray-100 dark:border-payne's_gray-800">
				<div className="space-y-0.5">
					<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider flex items-center gap-2">
						<User size={16} className="text-blue_munsell-500" />
						Team Roster & Roles
					</h2>
					<p className="text-xs text-outer_space-500 dark:text-platinum-400">
						Manage personnel access permissions and project assignments
					</p>
				</div>
				<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-french_gray-100 dark:bg-payne's_gray-800 text-outer_space-700 dark:text-platinum-300 border border-french_gray-200 dark:border-payne's_gray-700">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
					{members.length} Active
				</span>
			</div>
			{/* Members List */}
			<div className="divide-y divide-french_gray-100 dark:divide-payne's_gray-800">
				{members.length === 0 ? (
					<div className="py-8 text-center text-xs text-outer_space-500 dark:text-platinum-400">
						No team members currently assigned.
					</div>
				) : (
					members.map((member) => {
						const isEditing = editingMemberId === member.id;
						const isDeleting = confirmDeleteId === member.id;
						return (
							<div
								key={member.id}
								className={`py-4 transition-all rounded-xl px-3 -mx-3 ${isEditing
									? "bg-blue_munsell-50/50 dark:bg-blue_munsell-950/20 border border-blue_munsell-200 dark:border-blue_munsell-900/50 my-2 shadow-xs"
									: "hover:bg-french_gray-50/60 dark:hover:bg-outer_space-800/50"
									}`}
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
									{/* Edit State and View State */}
									{isEditing ? (
										<div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-french_gray-200 dark:border-payne's_gray-700">
											<div className="relative flex-1 md:w-48">
												<Award
													size={13}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-outer_space-400"
												/>
												<input
													type="text"
													value={editMemberRole}
													onChange={(e) => setEditMemberRole(e.target.value)}
													className="w-full rounded-xl border border-french_gray-300 dark:border-payne's_gray-600 bg-white dark:bg-outer_space-800 pl-8 pr-3 py-1.5 text-xs text-outer_space-900 dark:text-platinum-100 focus:outline-hidden focus:ring-2 focus:ring-blue_munsell-500/50"
													placeholder="Role Title (e.g. Lead Dev)"
												/>
											</div>
											<div className="relative flex-1 md:w-36">
												<Shield
													size={13}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-outer_space-400"
												/>
												<select
													value={editMemberAccess}
													onChange={(e) =>
														setEditMemberAccess(e.target.value as AccessRole)
													}
													className="w-full rounded-xl border border-french_gray-300 dark:border-payne's_gray-600 bg-white dark:bg-outer_space-800 pl-8 pr-3 py-1.5 text-xs text-outer_space-900 dark:text-platinum-100 focus:outline-hidden focus:ring-2 focus:ring-blue_munsell-500/50 capitalize"
												>
													<option value="administrator">Admin</option>
													<option value="member">Member</option>
													<option value="viewer">Viewer</option>
												</select>
											</div>
											<div className="flex items-center gap-1.5 ml-auto md:ml-0">
												<button
													type="button"
													onClick={() => handleEditMemberSave(member.id)}
													className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue_munsell-500 hover:bg-blue_munsell-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
													title="Save Changes"
												>
													<Check size={13} /> Save
												</button>
												<button
													type="button"
													onClick={() => setEditingMemberId(null)}
													className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-french_gray-200/70 hover:bg-french_gray-300 dark:bg-payne's_gray-700 dark:hover:bg-payne's_gray-600 text-outer_space-700 dark:text-platinum-200 rounded-xl text-xs font-medium transition-all"
													title="Cancel"
												>
													<X size={13} />
												</button>
											</div>
										</div>
									) : (
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
											{/* Action Buttons */}
											<div className="flex items-center gap-1 border-l border-french_gray-200 dark:border-payne's_gray-700 pl-3">
												{isDeleting ? (
													<div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 p-1 rounded-xl border border-red-200 dark:border-red-900">
														<span className="text-[10px] font-semibold text-red-600 dark:text-red-400 px-1.5">
															Remove?
														</span>
														<button
															type="button"
															onClick={() => {
																handleDeleteMember(member.id);
																setConfirmDeleteId(null);
															}}
															className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold transition-all"
														>
															Yes
														</button>
														<button
															type="button"
															onClick={() => setConfirmDeleteId(null)}
															className="px-2 py-1 bg-french_gray-200 dark:bg-payne's_gray-700 text-outer_space-700 dark:text-platinum-200 rounded-lg text-[10px] font-medium"
														>
															No
														</button>
													</div>
												) : (
													<>
														<button
															type="button"
															onClick={() => handleEditMemberStart(member)}
															className="p-2 text-outer_space-500 hover:text-blue_munsell-500 hover:bg-blue_munsell-50 dark:hover:bg-blue_munsell-950/30 rounded-xl transition-colors"
															title="Edit Role & Access"
														>
															<Edit size={15} />
														</button>
														<button
															type="button"
															onClick={() => setConfirmDeleteId(member.id)}
															className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
															title="Remove Member"
														>
															<Trash2 size={15} />
														</button>
													</>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}