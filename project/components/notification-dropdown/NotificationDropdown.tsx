"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Project Assigned",
    description: "You have been added to the Dashboard Redesign project.",
    time: "10m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Server Maintenance",
    description: "Scheduled maintenance will occur tonight at 12:00 AM.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Report Generated",
    description: "Your monthly analytics report is ready for download.",
    time: "5h ago",
    unread: false,
  },
];

export default function NotificationDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    router.push("/notifications"); // Adjust route if your notification page path is different
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications((prev) => !prev)}
        className="relative rounded-xl p-2.5 text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
        aria-label="View notifications"
      >
        <Bell size={18} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white" />
      </button>

      {/* Notification Popup Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-100 bg-white py-3 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-150 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-3">
            <h3 className="text-sm font-semibold text-slate-800">
              Notifications
            </h3>
            <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-600">
              2 New
            </span>
          </div>

          {/* Notification List */}
          <div className="max-h-80 divide-y divide-slate-50 overflow-y-auto">
            {MOCK_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className={`flex cursor-pointer gap-3 p-4 transition-colors hover:bg-slate-50/80 ${
                  item.unread ? "bg-slate-50/40" : ""
                }`}
              >
                <div className="mt-0.5">
                  {item.unread ? (
                    <span className="flex h-2 w-2 rounded-full bg-cyan-500" />
                  ) : (
                    <CheckCircle2 size={14} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold leading-none text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 pt-0.5 text-[10px] text-slate-400">
                    <Clock size={10} />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer / View All Link */}
          <div className="border-t border-slate-100 px-4 pt-2 text-center">
            <button
              onClick={handleViewAllNotifications}
              className="w-full py-2 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
