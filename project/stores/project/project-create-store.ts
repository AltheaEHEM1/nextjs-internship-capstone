// stores/project-create-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type WorkflowType = "starter" | "project_management";
export type SubViewType = "main" | "views" | "statuses";

export interface ProjectCreateState {
  workflow: WorkflowType;
  setWorkflow: (w: WorkflowType) => void;
  activeSubView: SubViewType;
  setActiveSubView: (v: SubViewType) => void;
  views: string[];
  setViews: (v: string[]) => void;
  statuses: {
    notStarted: string[];
    active: string[];
    done: string[];
    closed: string[];
  };
  setStatuses: (s: {
    notStarted: string[];
    active: string[];
    done: string[];
    closed: string[];
  }) => void;
  handleWorkflowChange: (type: WorkflowType) => void;
  handleFinalCreate: () => {
    workflow: WorkflowType;
    views: string[];
    statuses: {
      notStarted: string[];
      active: string[];
      done: string[];
      closed: string[];
    };
  };
}

export const useProjectCreateStore = create<ProjectCreateState>()(
  devtools((set, get) => ({
    workflow: "starter",
    setWorkflow: (w) => set({ workflow: w }),
    activeSubView: "main",
    setActiveSubView: (v) => set({ activeSubView: v }),
    views: ["List", "Board"],
    setViews: (v) => set({ views: v }),
    statuses: {
      notStarted: ["Not started", "To do"],
      active: ["Active", "In progress"],
      done: ["Done"],
      closed: ["Closed", "Complete"],
    },
    setStatuses: (s) => set({ statuses: s }),
    handleWorkflowChange: (type) => {
      set({ workflow: type });
      if (type === "starter") {
        set({
          views: ["List", "Board"],
          statuses: {
            notStarted: ["Not started", "To do"],
            active: ["Active", "In progress"],
            done: ["Done"],
            closed: ["Closed", "Complete"],
          },
        });
      } else {
        set({
          views: ["List", "Board", "Calendar", "Gantt", "Team"],
          statuses: {
            notStarted: ["Not started", "To do"],
            active: [
              "Active",
              "Planning",
              "In progress",
              "At risk",
              "Update Required",
              "On hold",
            ],
            done: ["Done", "Complete"],
            closed: ["Closed", "Cancelled"],
          },
        });
      }
    },
    handleFinalCreate: () => {
      const { workflow, views, statuses } = get();
      return { workflow, views, statuses };
    },
  }))
);
