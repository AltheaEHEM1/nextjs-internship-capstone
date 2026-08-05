"use client";

import { useCallback, useState } from "react";

export function useBaseAdmin(initial = false) {
	const [sidebarOpen, setSidebarOpen] = useState(initial);

	const open = useCallback(() => setSidebarOpen(true), []);
	const close = useCallback(() => setSidebarOpen(false), []);
	const toggle = useCallback(() => setSidebarOpen((v) => !v), []);

	return { sidebarOpen, open, close, toggle };
}
