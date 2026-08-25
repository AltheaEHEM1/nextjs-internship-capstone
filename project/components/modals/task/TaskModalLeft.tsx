import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { taskSchema } from "@/lib/validation/Validations";
import { useTaskModalStore } from "@/stores/task/TaskModalStore";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TaskModalLeft() {
	const {
		mode,
		taskName,
		setTaskName,
		description,
		setDescription,
		handleFieldChange,
		currentUserPermission,
		isCheckingName,
		setIsCheckingName,
		isNameUnique,
		setIsNameUnique,
	} = useTaskModalStore();

	const onTitleBlur = () => {
		setTouched((prev) => ({ ...prev, taskName: true }));
		if (mode === "view") {
			handleFieldChange("title", taskName);
		}
	};

	const onDescBlur = () => {
		setTouched((prev) => ({ ...prev, description: true }));
		if (mode === "view") {
			handleFieldChange("description", description);
		}
	};

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [maxLengthErrors, setMaxLengthErrors] = useState<
		Record<string, string>
	>({});

	useEffect(() => {
		const newErrors: Record<string, string> = {};

		const titleRes = taskSchema.shape.title.safeParse(taskName.trim());
		if (!titleRes.success)
			newErrors.taskName = titleRes.error.issues[0].message;

		const descRes = taskSchema.shape.description.safeParse(description.trim());
		if (!descRes.success)
			newErrors.description = descRes.error.issues[0].message;

		setErrors(newErrors);
		useTaskModalStore.setState({ errors: newErrors }); // We should probably put errors in TaskModalStore so the Create button can be disabled by it. Wait, the store doesn't have errors right now. We can just add it or handle it there. Actually, the easiest way without modifying store is to update the button logic to just use standard states. But I'll modify the store if needed. Actually, `TaskModal.tsx` is right next to it, I can add `hasErrors: boolean` to the store.
	}, [taskName, description]);

	useEffect(() => {
		if (mode !== "create") return;
		if (!taskName || taskName.trim() === "") {
			setIsNameUnique(null);
			setIsCheckingName(false);
			return;
		}

		setIsCheckingName(true);
		setIsNameUnique(null);

		const timeoutId = setTimeout(async () => {
			const req = await fetch(
				`/api/task/check-name?name=${encodeURIComponent(taskName)}`,
			);
			const res = await req.json();
			setIsCheckingName(false);
			if (res.success) {
				setIsNameUnique(res.isUnique as boolean);
			} else {
				setIsNameUnique(null);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [taskName, mode, setIsCheckingName, setIsNameUnique]);

	return (
		<div className="flex flex-col gap-6">
			{/* Task Title */}
			<div>
				<label
					htmlFor="taskSummary"
					className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
				>
					Task Name <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<input
						id="taskSummary"
						type="text"
						required
						value={taskName}
						onChange={(e) => {
							let val = e.target.value.replace(/\s{2,}/g, " ");
							if (val.length > 200) {
								val = val.slice(0, 200);
								setMaxLengthErrors((prev) => ({
									...prev,
									taskName: "Title is too long",
								}));
							} else {
								setMaxLengthErrors((prev) => ({ ...prev, taskName: "" }));
							}
							setTaskName(val);
							setTouched((prev) => ({ ...prev, taskName: true }));
						}}
						onBlur={onTitleBlur}
						disabled={
							currentUserPermission !== "administrator" && mode === "view"
						}
						placeholder="e.g. Implement Role-Based Access Control module"
						className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
							mode === "create" && taskName.trim() !== ""
								? isCheckingName
									? "border-slate-200 focus:ring-slate-400 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-slate-900 dark:text-white"
									: isNameUnique
										? "border-[#1e9b65] focus:ring-[#1e9b65] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
										: "border-red-500 focus:ring-red-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
								: touched.taskName && errors.taskName
									? "border-red-500 focus:ring-red-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
									: "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-cyan-500/50"
						}`}
					/>
					{mode === "create" && (
						<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							{isCheckingName && (
								<Loader2 size={16} className="animate-spin text-slate-400" />
							)}
							{!isCheckingName &&
								taskName.trim() !== "" &&
								isNameUnique === true && (
									<CheckCircle2 size={16} className="text-[#1e9b65]" />
								)}
							{!isCheckingName &&
								taskName.trim() !== "" &&
								isNameUnique === false && (
									<XCircle size={16} className="text-red-500" />
								)}
						</div>
					)}
				</div>
				{mode === "create" &&
					!isCheckingName &&
					isNameUnique === false &&
					taskName.trim() !== "" && (
						<p className="mt-1.5 text-xs text-red-500 font-medium">
							A task with this title already exists.
						</p>
					)}
				{touched.taskName && (errors.taskName || maxLengthErrors.taskName) && (
					<p className="mt-1.5 text-xs text-red-500 font-medium">
						{errors.taskName || maxLengthErrors.taskName}
					</p>
				)}
			</div>

			{/* Description Real React Quill Editor */}
			<div>
				<label
					htmlFor="description"
					className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
				>
					Description
				</label>
				<div
					className={`bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-800 [&_.ql-container]:border-slate-200 dark:[&_.ql-container]:border-slate-800 [&_.ql-container]:rounded-b-xl [&_.ql-editor]:min-h-[320px] dark:[&_.ql-snow_.ql-stroke]:stroke-slate-400 dark:[&_.ql-snow_.ql-fill]:fill-slate-400 dark:[&_.ql-snow_.ql-picker]:text-slate-400 dark:[&_.ql-editor]:text-white ${currentUserPermission !== "administrator" && mode === "view" ? "opacity-50 pointer-events-none" : ""}`}
				>
					<ReactQuill
						theme="snow"
						value={description}
						onChange={(content) => {
							let val = content;
							// Very rough length check for HTML content, real check is complex but we can do a naive one
							if (val.length > 5000) {
								val = val.slice(0, 5000);
								setMaxLengthErrors((prev) => ({
									...prev,
									description: "Description is too long",
								}));
							} else {
								setMaxLengthErrors((prev) => ({ ...prev, description: "" }));
							}
							setDescription(val);
							setTouched((prev) => ({ ...prev, description: true }));
						}}
						onBlur={onDescBlur}
						readOnly={
							currentUserPermission !== "administrator" && mode === "view"
						}
						modules={{
							toolbar: [
								["bold", "italic", "underline", "strike"],
								[{ list: "ordered" }, { list: "bullet" }],
								["link", "code-block"],
								["clean"],
							],
						}}
						placeholder="Add a more detailed description..."
						className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-white [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-slate-200 [&_.ql-editor]:min-h-[150px] dark:[&_.ql-toolbar]:border-slate-800 dark:[&_.ql-container]:border-slate-800 ${touched.description && errors.description ? "[&_.ql-container]:border-red-500 [&_.ql-toolbar]:border-red-500" : ""}`}
					/>
				</div>
				{touched.description &&
					(errors.description || maxLengthErrors.description) && (
						<p className="mt-1.5 text-xs text-red-500 font-medium">
							{errors.description || maxLengthErrors.description}
						</p>
					)}
			</div>
		</div>
	);
}
