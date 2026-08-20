"use client";

import {
	AlertCircle,
	ArrowLeft,
	Briefcase,
	Folder,
	Mail,
	Trash2,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/alert";
import ConfirmDialog from "@/components/modals/team/ConfirmDialog";
import { usePersonManagement } from "@/hooks/team/useTeamManagement";
import { useBreadcrumbStore } from "@/stores/components/breadcrumb-store";

export default function PersonDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: personId } = use(params);
	const router = useRouter();
	const setMapping = useBreadcrumbStore((state) => state.setMapping);

	const {
		personDetail: person,
		isLoading,
		error,
		isDeleting,
		confirmOpen,
		setConfirmOpen,
		handleDeleteClick,
		handleDeleteConfirm,
	} = usePersonManagement(personId);

	useEffect(() => {
		if (person?.name) {
			setMapping(personId, person.name);
		}
	}, [person?.name, personId, setMapping]);

	if (isLoading) {
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
				<div className="rounded-xl border border-french_gray-200 bg-white p-8 text-center dark:border-paynes_gray-600 dark:bg-outer_space-500">
					<p className="text-outer_space-500 dark:text-platinum-300">
						Loading person details...
					</p>
				</div>
			</div>
		);
	}

	if (error || !person) {
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
					<AlertDescription>{error || "Person not found."}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-12">
			{/* Navigation Header */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => router.back()}
					className="inline-flex items-center gap-2 text-sm font-medium text-outer_space-700 dark:text-platinum-300 hover:text-outer_space-900 dark:hover:text-platinum-100 transition-all hover:scale-105"
				>
					<ArrowLeft size={16} />
					Back
				</button>

				<button
					type="button"
					onClick={handleDeleteClick}
					disabled={isDeleting}
					className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
				>
					<Trash2 size={15} />
					{isDeleting ? "Deleting..." : "Delete Member"}
				</button>
			</div>

			{/* Profile Header */}
			<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
					<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue_munsell-500 text-2xl font-bold text-white shadow-md">
						{person.avatar &&
						(person.avatar.startsWith("http") ||
							person.avatar.startsWith("data:")) ? (
							<Image
								src={person.avatar}
								alt={person.name}
								width={80}
								height={80}
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
					<div className="space-y-1">
						<h2 className="text-2xl font-bold text-outer_space-800 dark:text-platinum-100">
							{person.name}
						</h2>
						<div className="flex flex-wrap items-center gap-4 text-xs text-outer_space-500 dark:text-platinum-300 pt-1">
							<span className="flex items-center gap-1.5">
								<Mail
									size={14}
									className="text-outer_space-400 dark:text-platinum-400"
								/>
								{person.email}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Detail Content */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Teams List */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500 space-y-4">
					<div className="flex items-center gap-2 text-outer_space-800 dark:text-platinum-100 font-bold text-base">
						<Users size={18} className="text-blue_munsell-500" />
						<h3>Teams Included</h3>
					</div>
					{person.teams.length === 0 ? (
						<p className="text-xs text-outer_space-400 dark:text-platinum-400 py-2">
							No teams joined yet.
						</p>
					) : (
						<div className="divide-y divide-french_gray-100 dark:divide-paynes_gray-600">
							{person.teams.map((team) => (
								<Link
									key={team.id}
									href={`/team/team/${team.id}`}
									className="py-3 flex items-center justify-between first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
								>
									<div className="flex items-center gap-3">
										{team.coverUrl ? (
											<div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-sm">
												<Image
													src={team.coverUrl}
													alt={team.name}
													width={40}
													height={40}
													className="absolute inset-0 h-full w-full object-cover"
													unoptimized
												/>
												<div className="absolute inset-0 bg-black/30" />
												<span className="relative text-lg z-10">
													{team.icon}
												</span>
											</div>
										) : (
											<div className="flex h-10 w-10 items-center justify-center rounded-md bg-platinum-100 text-lg dark:bg-paynes_gray-500">
												{team.icon}
											</div>
										)}
										<span className="font-semibold text-xs text-outer_space-800 dark:text-platinum-100">
											{team.name}
										</span>
									</div>
									<span className="flex items-center gap-1.5 rounded-md bg-platinum-100 dark:bg-paynes_gray-500 px-2 py-0.5 text-xs font-medium text-outer_space-700 dark:text-platinum-200">
										<Briefcase size={13} />
										{team.role || "Member"}
									</span>
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Projects List */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-paynes_gray-600 dark:bg-outer_space-500 space-y-4">
					<div className="flex items-center gap-2 text-outer_space-800 dark:text-platinum-100 font-bold text-base">
						<Folder size={18} className="text-blue_munsell-500" />
						<h3>Assigned Projects</h3>
					</div>
					{person.projects.length === 0 ? (
						<p className="text-xs text-outer_space-400 dark:text-platinum-400 py-2">
							No assigned projects yet.
						</p>
					) : (
						<div className="divide-y divide-french_gray-100 dark:divide-paynes_gray-600">
							{person.projects.map((project) => (
								<Link
									key={project.id}
									href={`/projects/${project.id}`}
									className="py-3 flex items-center justify-between first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
								>
									<div>
										<h4 className="font-semibold text-xs text-outer_space-800 dark:text-platinum-100">
											{project.name}
										</h4>
										<p className="text-[11px] text-outer_space-400 dark:text-platinum-400">
											{project.role}
										</p>
									</div>
									<span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
										{project.status}
									</span>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>

			<ConfirmDialog
				opened={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleDeleteConfirm}
				title="Remove Member"
				description={`Are you sure you want to remove ${person.name}? This will revoke their access to all associated teams.`}
				confirmLabel="Remove Member"
				variant="danger"
				loading={isDeleting}
			/>
		</div>
	);
}
