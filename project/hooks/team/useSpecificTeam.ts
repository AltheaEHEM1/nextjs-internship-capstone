import { useState } from "react";

export type SpecificTeamMember = {
    id: string;
    name: string;
    role: string;
    avatar: string;
};

export type SpecificTeam = {
    name: string;
    icon: string;
    coverUrl: string;
    members: SpecificTeamMember[];
};

const defaultTeam: SpecificTeam = {
    name: "Frontend Core Team",
    icon: "💻",
    coverUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    members: [
        { id: "1", name: "Alex Mercer", role: "Lead Frontend", avatar: "A" },
        { id: "2", name: "Sarah Jenkins", role: "UI Designer", avatar: "S" },
    ],
};

export function useSpecificTeam(initialTeam?: SpecificTeam) {
    const [team] = useState<SpecificTeam>(initialTeam ?? defaultTeam);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((open) => !open);
    const closeMenu = () => setIsMenuOpen(false);
    const openAddMemberModal = () => setIsAddMemberOpen(true);
    const closeAddMemberModal = () => setIsAddMemberOpen(false);

    return {
        team,
        isMenuOpen,
        isAddMemberOpen,
        toggleMenu,
        openAddMemberModal,
        closeAddMemberModal,
        closeMenu,
    };
}
