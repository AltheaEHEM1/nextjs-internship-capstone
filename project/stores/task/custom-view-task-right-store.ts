"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TaskData = {
  status: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  label: string;
  startDate: string;
};

type UpdateTaskCallback = (updatedFields: Record<string, any>) => void;

export interface CustomViewTaskRightState {
  // fields
  status: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  label: string;
  startDate: string;
  // callback
  onUpdateTask?: UpdateTaskCallback;
  // setters
  setStatus: (s: string) => void;
  setAssignee: (a: string) => void;
  setPriority: (p: "low" | "medium" | "high") => void;
  setDueDate: (d: string) => void;
  setLabel: (l: string) => void;
  setStartDate: (d: string) => void;
  // initializer
  initialize: (taskData: TaskData, onUpdateTask?: UpdateTaskCallback) => void;
  // handler to propagate changes
  handleFieldChange: (field: string, value: any) => void;
}

export const useCustomViewTaskRightStore = create<CustomViewTaskRightState>()(
  devtools((set, get) => ({
    // defaults
    status: "",
    assignee: "",
    priority: "low",
    dueDate: "",
    label: "",
    startDate: "",
    onUpdateTask: undefined,
    // setters
    setStatus: (s) => set({ status: s }),
    setAssignee: (a) => set({ assignee: a }),
    setPriority: (p) => set({ priority: p }),
    setDueDate: (d) => set({ dueDate: d }),
    setLabel: (l) => set({ label: l }),
    setStartDate: (d) => set({ startDate: d }),
    // initializer
    initialize: (taskData, onUpdateTask) => {
      set({
        status: taskData.status,
        assignee: taskData.assignee,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        label: taskData.label,
        startDate: taskData.startDate,
        onUpdateTask,
      });
    },
    // handler to forward updates
    handleFieldChange: (field, value) => {
      const { onUpdateTask } = get();
      if (onUpdateTask) {
        onUpdateTask({ [field]: value });
      }
    },
  }))
);
