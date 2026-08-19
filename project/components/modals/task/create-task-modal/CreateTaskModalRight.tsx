import { Flag, Tag } from "lucide-react";
import { useCustomCreateTaskStore } from "@/stores/task/custom-create-task-store";
import type { Status } from "@/stores/task/custom-create-task-store";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface CreateTaskModalRightProps {
    projectData: {
        members: { id: string; userId: string; name: string }[];
        statuses: { id: string; name: string; color: string }[];
        labels: { name: string; color: string }[];
        priorities: [string, ...string[]];
    } | null;
    isLoading: boolean;
    onOpenAddPriority?: () => void;
    onOpenAddLabel?: () => void;
}

export default function CreateTaskModalRight({
    projectData,
    isLoading,
    onOpenAddPriority,
    onOpenAddLabel,
}: CreateTaskModalRightProps) {
    const {
        status,
        setStatus,
        priority,
        setPriority,
        team,
        setTeam,
        startDate,
        setStartDate,
        dueDate,
        setDueDate,
        labels,
        setLabels,
    } = useCustomCreateTaskStore();
    const { user } = useUser();

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex flex-col gap-4">
            {/* Status */}
            <div>
                <label
                    htmlFor="status"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >
                    Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <option value="">Loading statuses...</option>
                    ) : projectData?.statuses.length ? (
                        projectData.statuses.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))
                    ) : (
                        <option value="">No statuses</option>
                    )}
                </select>
            </div>

            {/* Member */}
            <div>
                <label
                    htmlFor="team"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >
                    Member
                </label>
                <select
                    id="team"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                    disabled={isLoading}
                >
                    <option value="">Select team member...</option>
                    {!isLoading &&
                        projectData?.members.map((m) => (
                            <option key={m.userId} value={m.userId}>
                                {m.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* Assignee & Priority Row */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="priority"
                            className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
                        >
                            Priority
                        </label>
                        {onOpenAddPriority && (
                            <button
                                type="button"
                                onClick={onOpenAddPriority}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                                <Flag size={12} /> Add Priority
                            </button>
                        )}
                    </div>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <option value="">Loading priorities...</option>
                        ) : projectData?.priorities?.length ? (
                            projectData.priorities.map((p) => (
                                <option key={p} value={p}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                            ))
                        ) : (
                            <option value="">No priorities</option>
                        )}
                    </select>
                </div>
            </div>

            {/* Start Date & Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                    >
                        Start Date
                    </label>
                    <input
                        id="startDate"
                        type="date"
                        min={today}
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            if (dueDate && e.target.value > dueDate) {
                                setDueDate(e.target.value);
                            }
                        }}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                    />
                </div>

                <div>
                    <label
                        htmlFor="dueDate"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                    >
                        Due Date
                    </label>
                    <input
                        id="dueDate"
                        type="date"
                        min={startDate || today}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                    />
                </div>
            </div>

            {/* Labels & Reporter Row */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="labels"
                            className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
                        >
                            Labels
                        </label>
                        {onOpenAddLabel && (
                            <button
                                type="button"
                                onClick={onOpenAddLabel}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                                <Tag size={12} /> Add Label
                            </button>
                        )}
                    </div>
                    <select
                        id="labels"
                        value={labels}
                        onChange={(e) => setLabels(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                        disabled={isLoading}
                    >
                        <option value="">Select label...</option>
                        {!isLoading &&
                            projectData?.labels.map((l) => (
                                <option key={l.name} value={l.name}>
                                    {l.name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Reporter */}
            <div>
                <label
                    htmlFor="reporter"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >
                    Reporter
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5">
                    {user?.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt="Reporter"
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                            {user?.firstName?.charAt(0) || user?.primaryEmailAddress?.emailAddress?.charAt(0) || "?"}
                        </div>
                    )}
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Loading..."}
                    </span>
                </div>
            </div>
        </div>
    );
}