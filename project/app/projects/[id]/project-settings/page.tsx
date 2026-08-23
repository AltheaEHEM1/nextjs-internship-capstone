import { redirect } from "next/navigation";
import { getProjectSettingsQuery } from "@/lib/queries/project";
import { getUserTeamsQuery } from "@/lib/queries/team";
import ProjectSettingsForm from "./ProjectSettingsForm";

interface ProjectSettingsPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProjectSettingsPage({
	params,
}: ProjectSettingsPageProps) {
	const { id } = await params;
	const [result, teamsResult] = await Promise.all([
		getProjectSettingsQuery(id),
		getUserTeamsQuery(),
	]);

	// If fetch failed, render the form with empty/fallback data
	if (!result.success || !result.data) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-sm text-outer_space-500 dark:text-platinum-400">
					Failed to load project settings. {result.error}
				</p>
			</div>
		);
	}

	const { data } = result;

	if (data.currentUserPermission !== "administrator") {
		redirect(`/projects/${id}`);
	}

	const availableTeams =
		teamsResult.success && teamsResult.data
			? teamsResult.data.map((t) => ({ id: t.id, name: t.name }))
			: [];

	return (
		<ProjectSettingsForm
			projectId={id}
			initialTitle={data.name}
			initialDescription={data.description}
			initialTeam={data.teamName}
			initialTeamId={data.teamId}
			availableTeams={availableTeams}
			initialMembers={data.members}
			initialStatuses={data.statuses}
		/>
	);
}
