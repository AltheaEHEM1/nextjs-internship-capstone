# Projectnify - Next.js Internship Capstone Project

# Project Overview

**Projectnify** is a comprehensive, modern project management and collaboration platform built with the Next.js App Router. It is designed to streamline workflows, enhance team collaboration, and provide powerful tools for task management, scheduling, and real-time updates. This project serves as the capstone for a 12-week full-stack development internship program.

### Key Features

- **Interactive Kanban Boards**: Drag-and-drop task management powered by `@dnd-kit`.
- **Advanced Scheduling & Gantt Charts**: Visual project timelines using `gantt-task-react` and `vis-timeline`.
- **Real-time Collaboration**: Instant updates and live sync across clients using `Pusher`.
- **Rich Text Editing**: Detailed task descriptions and comments with `react-quill-new`.
- **Whiteboarding**: Integrated visual brainstorming and diagramming using `tldraw`.
- **Interactive Calendars**: Comprehensive event and deadline tracking via `react-big-calendar`.
- **Data Analytics & Dashboards**: Visual insights into project progress using `recharts`.
- **Secure Authentication**: Robust user management and authentication powered by `Clerk`.
- **Email Notifications**: Automated project alerts and invites using `nodemailer` and `@react-email`.
- **Responsive & Accessible UI**: Beautiful, accessible components built with Tailwind CSS, Radix UI, and Lucide Icons.

---

## Learning Objectives

By completing this project, interns will demonstrate proficiency in:
- **Full-Stack Next.js Development** (App Router, Server Components, Server Actions)
- **Secure Authentication** (Clerk integration)
- **Database Design & Management** (PostgreSQL with Drizzle ORM)
- **State Management** (Zustand for client-side state)
- **Professional Git Workflow** (GitHub Flow, PR reviews)
- **Testing Strategy** (Unit, Integration, E2E)
- **Production Deployment** (Vercel CI/CD)



## Architecture & Modules

The application is structured into clear, logical modules based on Next.js 16 conventions:

### `app/` (Routing & Pages)
- **`(auth)`**: Handles sign-in and sign-up pages using Clerk.
- **`api/`**: Contains all backend endpoints and server actions.
- **`dashboard/`**: The main authenticated view for the user's workspace.
- **`projects/`**: Dedicated routes for individual project workspaces and settings.
- **`team/`**: Routes for team management and member overview.
- **`invitation/` & `notification/`**: Routes for handling user invites and alerting.

### `components/` (UI & Feature Components)
- **`board/`**: Interactive Kanban board UI.
- **`modals/`**: Dialog components.
- **`project-component/`**: Reusable parts of a project view (headers, analytics charts).
- **`layout/`, `sidebar/`, `header/`**: Core structural components for the dashboard.
- **`emails/`**: React-Email templates for notifications and invitations.
- **`theme-color/`**: Components for handling dark mode and theme variations.
- **`toast/`, `alert/`, `notification/`**: User feedback mechanisms.

### `hooks/` (Custom React Logic)
- **`project/`**: Hooks like `useProjectSettings`, `useProjectData`.
- **`task/`**: Logic for task manipulation.
- **`team/`, `invitation/`**: Logic for managing members and roles.
- **`notification/`**: Hooks to subscribe to and manage real-time alerts.

### `lib/` (Utilities & Integrations)
- **`db/`**: Drizzle ORM configuration, schema definitions, and migration utilities.
- **`queries/`**: Reusable database query functions for fetching normalized data.
- **`real-time-board/`**: Pusher configuration and event handlers.
- **`notifications/`**: Email sending logic via Nodemailer.
- **`validation/`**: Zod schemas for strict data validation.

---

## Core Functions & Libraries

- **Framework**: Next.js 16 (App Router) with React 19.
- **Authentication Flow**: Managed by `@clerk/nextjs`.
- **Database & ORM**: PostgreSQL via `drizzle-orm` and `drizzle-kit`.
- **Kanban Drag-and-Drop (`@dnd-kit`)**: Robust collision detection, sortable context, and state updates.
- **Real-Time Synchronization (`Pusher`)**: Broadcasting events like `task-moved`, `comment-added` for live updates.
- **Email Dispatch**: `nodemailer` + `@react-email/render`.
- **Data Fetching & State (`Zustand`)**: Global client-side state management.
- **UI & Styling**: Tailwind CSS, Radix UI primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, and `lucide-react`.

---

## Individual Development & Collaboration

**Each intern should fork this repository individually** to create their own complete implementation.

### Task Tracking & Progress Management

Create issues in your forked repository to track your progress:
- Use GitHub Issues or Projects to plan out your weekly tasks.
- Track against milestones: setup, auth, database, frontend, backend, testing, deployment.
- Organize tasks into tags (e.g., `frontend`, `backend`, `bug`).

---

## Getting Started

### Prerequisites
- **Node.js**: v20+ LTS recommended
- **pnpm**: Latest version (`npm install -g pnpm`)
- **PostgreSQL**: Running local or remote instance

### Setup Instructions

1. **Clone the repository (or your fork)**
   ```bash
   git clone <repository-url>
   cd nextjs-internship-capstone/project
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and add your keys:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/projectnify
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   ```

4. **Database Setup**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` / `pnpm check:fix` - Run and auto-fix Biome linting checks.
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` - Drizzle ORM tools.

---

## Vercel Deployment

> **The GitHub Actions workflow is disabled by default.** Use the manual steps below to deploy. Enable the workflow only when you're ready for automated deployments.

### Manual Deployment
1. Install Vercel CLI: `pnpm add -g vercel`
2. Log in: `vercel login`
3. Link your project: `vercel link`
4. Deploy a preview: `vercel`
5. Deploy to production: `vercel --prod`
