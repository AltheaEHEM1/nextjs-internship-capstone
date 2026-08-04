
"use client";

import { useState } from "react";
import { 
    Plus, 
    Trash2, 
    MessageSquare, 
    History, 
    X 
} from "lucide-react";

interface ViewTaskLeftProps {
    taskData: {
        title: string;
        description: string;
        status: string;
    };
    onUpdateTask?: (updatedFields: Record<string, any>) => void;
}

export default function ViewTaskModalLeft({
    taskData,
    onUpdateTask,
}: ViewTaskLeftProps) {
    const [title, setTitle] = useState(taskData.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const [description, setDescription] = useState(taskData.description);
    const [isEditingDesc, setIsEditingDesc] = useState(false);

    // Activity Tab State
    const [activeTab, setActiveTab] = useState<"comments" | "history">("comments");
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState("");

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        if (title !== taskData.title && onUpdateTask) {
            onUpdateTask({ title });
        }
    };

    const handleDescBlur = () => {
        setIsEditingDesc(false);
        if (description !== taskData.description && onUpdateTask) {
            onUpdateTask({ description });
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setComments((prev) => [...prev, newComment]);
        setNewComment("");
    };

    return (
        <>
             {/* Title */}
                <div>
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            autoFocus
                            className="w-full text-xl font-bold rounded-lg border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    ) : (
                        <h2 
                            onClick={() => setIsEditingTitle(true)}
                            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 rounded transition"
                            title="Click to edit title"
                        >
                            {title}
                        </h2>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                    </label>
                    {isEditingDesc ? (
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescBlur}
                            autoFocus
                            rows={4}
                            className="w-full text-sm rounded-lg border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    ) : (
                        <div 
                            onClick={() => setIsEditingDesc(true)}
                            className="text-sm text-gray-700 dark:text-gray-300 min-h-[60px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            title="Click to edit description"
                        >
                            {description || "Add a more detailed description..."}
                        </div>
                    )}
                </div>

                {/* Activity Tab Section */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("comments")}
                            className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition border-b-2 ${
                                activeTab === "comments"
                                    ? "border-[#1e9b65] text-[#1e9b65]"
                                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                            }`}
                        >
                            <MessageSquare size={14} /> Comments ({comments.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition border-b-2 ${
                                activeTab === "history"
                                    ? "border-[#1e9b65] text-[#1e9b65]"
                                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                            }`}
                        >
                            <History size={14} /> History
                        </button>
                    </div>

                    {activeTab === "comments" ? (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                    className="w-full text-sm rounded-lg border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                {comments.map((comment, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                                        {comment}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 py-3 italic">
                            Task created and status set to {taskData.status}.
                        </div>
                    )}
                </div>
        </>
    );
}