// stores/custom-view-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ViewName = string;

export interface CustomViewState {
  // Currently selected view names
  selectedViews: ViewName[];
  // Setter for selected views (internal use)
  setSelectedViews: (views: ViewName[]) => void;
  // Callback supplied by the component to propagate changes upstream
  onChangeViews: (views: ViewName[]) => void;
  // Toggle a view name (ignores the required "List" view)
  toggleView: (viewName: ViewName) => void;
  // Initialise the store with props when the component mounts/updates
  initialize: (views: ViewName[], onChange: (views: ViewName[]) => void) => void;
}

export const useCustomViewStore = create<CustomViewState>()(
  devtools((set, get) => ({
    selectedViews: [],
    setSelectedViews: (views) => set({ selectedViews: views }),
    onChangeViews: () => {},
    initialize: (views, onChange) => {
      set({ selectedViews: views, onChangeViews: onChange });
    },
    toggleView: (viewName) => {
      if (viewName === "List") return; // List view is mandatory and cannot be toggled
      const { selectedViews, onChangeViews } = get();
      const isActive = selectedViews.includes(viewName);
      const newViews = isActive
        ? selectedViews.filter((v) => v !== viewName)
        : [...selectedViews, viewName];
      // Propagate change to parent component
      onChangeViews(newViews);
      // Update local store state
      set({ selectedViews: newViews });
    },
  }))
);
