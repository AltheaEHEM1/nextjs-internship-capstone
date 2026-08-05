import { useState, useCallback } from "react";

/**
 * Manages the open/close state of the mobile sidebar.
 * @param initialOpen - Whether the sidebar starts open (default `false`).
 */
export function useBaseAdmin(initialOpen = false) {
	const [sidebarOpen, setSidebarOpen] = useState(initialOpen);

	const open = useCallback(() => setSidebarOpen(true), []);
	const close = useCallback(() => setSidebarOpen(false), []);

	return { sidebarOpen, open, close };
}
