import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface UseProjectHeaderParams {
	projectId?: string;
	onOpenSettings?: () => void;
	onOpenAddPriority?: () => void;
	onOpenAddLabel?: () => void;
}

export function useProjectHeader({
	projectId,
	onOpenSettings,
	onOpenAddPriority,
	onOpenAddLabel,
}: UseProjectHeaderParams) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSettings = () => {
		if (onOpenSettings) {
			onOpenSettings();
		} else if (projectId) {
			router.push(`/projects/${projectId}/project-settings`);
		}
	};

	return {
		dropdownOpen,
		setDropdownOpen,
		isCreateTaskOpen,
		setIsCreateTaskOpen,
		dropdownRef,
		handleSettings,
	};
}
