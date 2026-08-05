"use client";

import { useMemo } from "react";

export function useMinDate() {
	return useMemo(() => new Date().toISOString().split("T")[0], []);
}
