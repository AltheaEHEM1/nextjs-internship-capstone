import { useUser } from "@clerk/nextjs";
import { useCustomCreateTaskStore } from "@/stores/task/custom-create-task-store";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateTaskModalLeft() {
    const { taskName, setTaskName, description, setDescription } = useCustomCreateTaskStore();
    const { user } = useUser();

    return (
        <div className="flex flex-col gap-4">
            {/* Task Title */}
            <div>
                <label
                    htmlFor="taskSummary"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >
                    Task Summary / Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="taskSummary"
                    type="text"
                    required
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g. Implement Role-Based Access Control module"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
                />
            </div>

            {/* Description Real React Quill Editor */}
            <div>
                <label
                    htmlFor="description"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >
                    Description
                </label>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-800 [&_.ql-container]:border-slate-200 dark:[&_.ql-container]:border-slate-800 [&_.ql-container]:rounded-b-xl [&_.ql-editor]:min-h-[320px] dark:[&_.ql-snow_.ql-stroke]:stroke-slate-400 dark:[&_.ql-snow_.ql-fill]:fill-slate-400 dark:[&_.ql-snow_.ql-picker]:text-slate-400 dark:[&_.ql-editor]:text-white">
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        placeholder="Provide detailed description, requirements, or acceptance criteria..."
                    />
                </div>
            </div>
        </div>
    );
}