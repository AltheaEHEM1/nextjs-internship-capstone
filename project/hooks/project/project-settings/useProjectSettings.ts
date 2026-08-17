"use client";

import { useState, useEffect } from "react";
import { useProjectSettingsStore } from "@/stores/project/project-settings/ProjectSettingsStore";
import type { AccessRole, TeamMember, ProjectLabel, ProjectPriority, ProjectStatus } from "@/stores/project/project-settings/ProjectSettingsStore";

/**
 * Combined custom hooks containing all Hook logic (useState, useEffect, Zustand consumption)
 */

// Hook extracted from MemberRole
export function useMemberRoleState() {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    return {
        confirmDeleteId,
        setConfirmDeleteId,
    };
}

// Hook extracted from page.tsx to initialize Zustand state on mount
export function useInitializeProjectSettings(initialData: {
    initialTitle: string;
    initialDescription: string;
    initialTeam: string;
    initialTeamId: string;
    availableTeams: { id: string; name: string }[];
    initialAccess: AccessRole;
    initialMembers: TeamMember[];
    initialLabels: ProjectLabel[];
    initialPriorities: ProjectPriority[];
    initialStatuses: ProjectStatus[];
}) {
    useEffect(() => {
        useProjectSettingsStore.getState().initialize({
            title: initialData.initialTitle,
            description: initialData.initialDescription,
            team: initialData.initialTeam,
            teamId: initialData.initialTeamId,
            availableTeams: initialData.availableTeams,
            access: initialData.initialAccess,
            members: initialData.initialMembers,
            labels: initialData.initialLabels,
            priorities: initialData.initialPriorities,
            statuses: initialData.initialStatuses,
        });
    }, []);
}

// Hook re-exporting store subscriptions for component reuse
export function useProjectSettings() {
    return useProjectSettingsStore();
}