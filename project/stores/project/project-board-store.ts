// Project Board Zustand store
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Task } from '@/components/board/TaskCard';

type ProjectBoardState = {
  kanbanColumns: string[];
  setKanbanColumns: (cols: string[]) => void;
  isViewTaskOpen: boolean;
  setIsViewTaskOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  activeColumn: string | null;
  setActiveColumn: (col: string | null) => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export const useProjectBoardStore = create<ProjectBoardState>()(
  devtools((set) => ({
    kanbanColumns: ["To Do", "In Progress", "Done"],
    setKanbanColumns: (cols) => set({ kanbanColumns: cols }),
    isViewTaskOpen: false,
    setIsViewTaskOpen: (open) => set({ isViewTaskOpen: open }),
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
    activeColumn: null,
    setActiveColumn: (col) => set({ activeColumn: col }),
    activeTask: null,
    setActiveTask: (task) => set({ activeTask: task }),
    tasks: [
      {
        id: 'task-1',
        workType: 'Feature',
        title: 'Design Landing Page',
        description: 'Create a modern, responsive landing page with hero section, features grid, and CTA.',
        status: 'To Do',
        assignee: 'CR',
        priority: 'high',
        dueDate: '2026-08-15',
        label: 'Design',
        startDate: '2026-08-06',
        reporter: 'SK',
      },
      {
        id: 'task-2',
        workType: 'Feature',
        title: 'Set up authentication flow',
        description: 'Implement login, register, and forgot password pages with form validation.',
        status: 'To Do',
        assignee: 'AS',
        priority: 'high',
        dueDate: '2026-08-12',
        label: 'Backend',
        startDate: '2026-08-06',
        reporter: 'SK',
      },
      {
        id: 'task-3',
        workType: 'Bug',
        title: 'Fix sidebar collapse on mobile',
        description: 'Sidebar overlay does not dismiss on outside tap in mobile viewports.',
        status: 'To Do',
        assignee: 'MC',
        priority: 'medium',
        dueDate: '2026-08-10',
        label: 'Bug',
        startDate: '2026-08-06',
        reporter: 'JR',
      },
      {
        id: 'task-4',
        workType: 'Feature',
        title: 'Implement Kanban drag & drop',
        description: 'Wire up dnd-kit for drag-and-drop between board columns with smooth animations.',
        status: 'In Progress',
        assignee: 'AS',
        priority: 'high',
        dueDate: '2026-08-09',
        label: 'Frontend',
        startDate: '2026-08-03',
        reporter: 'SK',
      },
      {
        id: 'task-5',
        workType: 'Feature',
        title: 'Build notification system',
        description: 'Create real-time notification bell with unread count badge and dropdown list.',
        status: 'In Progress',
        assignee: 'MC',
        priority: 'medium',
        dueDate: '2026-08-11',
        label: 'Frontend',
        startDate: '2026-08-04',
        reporter: 'SK',
      },
      {
        id: 'task-6',
        workType: 'Chore',
        title: 'Configure CI/CD pipeline',
        description: 'Set up GitHub Actions for automated testing, linting, and deployment to staging.',
        status: 'In Progress',
        assignee: 'DC',
        priority: 'medium',
        dueDate: '2026-08-08',
        label: 'DevOps',
        startDate: '2026-08-02',
        reporter: 'AS',
      },
      {
        id: 'task-7',
        workType: 'Feature',
        title: 'Create team management UI',
        description: 'Build team listing page with member cards, invite modal, and role badges.',
        status: 'Done',
        assignee: 'CR',
        priority: 'high',
        dueDate: '2026-08-05',
        label: 'Design',
        startDate: '2026-07-28',
        reporter: 'SK',
      },
      {
        id: 'task-8',
        workType: 'Chore',
        title: 'Set up project Zustand stores',
        description: 'Create Zustand stores for project, team, and board state management.',
        status: 'Done',
        assignee: 'AS',
        priority: 'medium',
        dueDate: '2026-08-03',
        label: 'Frontend',
        startDate: '2026-07-30',
        reporter: 'AS',
      },
      {
        id: 'task-9',
        workType: 'Bug',
        title: 'Fix dark mode toggle persistence',
        description: 'Dark mode resets to light on page refresh — store preference in localStorage.',
        status: 'Done',
        assignee: 'JR',
        priority: 'low',
        dueDate: '2026-08-02',
        label: 'Bug',
        startDate: '2026-07-31',
        reporter: 'JR',
      },
    ],
    setTasks: (tasks) => set({ tasks }),
  }))
);
