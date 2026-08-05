"use client";

import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { useEffect, useRef } from "react";

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let timeline: { destroy: () => void } | null = null;

    Promise.all([import("vis-timeline/peer"), import("vis-data")]).then(([{ Timeline: VisTimeline }, { DataSet }]) => {
      if (!containerRef.current) return;

      const now = new Date();
      const msInDay = 24 * 60 * 60 * 1000;

      const items = new DataSet([
        {
          id: 1,
          content: "Discovery & Planning",
          start: new Date(now.getTime() - 30 * msInDay),
          end: new Date(now.getTime() - 20 * msInDay),
          group: 1,
        },
        {
          id: 2,
          content: "Design System",
          start: new Date(now.getTime() - 22 * msInDay),
          end: new Date(now.getTime() - 10 * msInDay),
          group: 1,
        },
        {
          id: 3,
          content: "Frontend Development",
          start: new Date(now.getTime() - 12 * msInDay),
          end: new Date(now.getTime() + 8 * msInDay),
          group: 2,
        },
        {
          id: 4,
          content: "API Integration",
          start: new Date(now.getTime() - 5 * msInDay),
          end: new Date(now.getTime() + 15 * msInDay),
          group: 2,
        },
        {
          id: 5,
          content: "QA & Testing",
          start: new Date(now.getTime() + 10 * msInDay),
          end: new Date(now.getTime() + 22 * msInDay),
          group: 3,
        },
        {
          id: 6,
          content: "Launch",
          start: new Date(now.getTime() + 24 * msInDay),
          end: new Date(now.getTime() + 26 * msInDay),
          group: 3,
        },
      ]);

      const groups = new DataSet([
        { id: 1, content: "Research" },
        { id: 2, content: "Engineering" },
        { id: 3, content: "Release" },
      ]);

      const options = {
        orientation: "top" as const,
        stack: false,
        showMajorLabels: true,
        showCurrentTime: true,
        zoomMin: 1000 * 60 * 60 * 24,
        zoomMax: 1000 * 60 * 60 * 24 * 90,
      };

      timeline = new VisTimeline(containerRef.current!, items, groups, options);
    });

    return () => {
      timeline?.destroy();
    };
  }, []);

  return (
    <div className="space-y-4 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
            Project Roadmap Timeline
          </h2>
          <p className="text-sm text-outer_space-500 dark:text-platinum-400">
            Track sequential product phases, feature rollouts, and major project
            milestones over time.
          </p>
        </div>
      </div>

      {/* Timeline Container Box */}
      <div className="overflow-hidden rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-100">
        <style jsx global>{`
          .vis-timeline {
            border: none !important;
            font-family: inherit;
          }
          .vis-item {
            background-color: #0ea5e9;
            border-color: #0284c7;
            color: #ffffff;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          .vis-time-axis .vis-text {
            color: inherit;
          }
          .dark .vis-panel.vis-center,
          .dark .vis-panel.vis-left,
          .dark .vis-panel.vis-right {
            background-color: #1e293b;
            border-color: #334155;
          }
          .dark .vis-time-axis .vis-text {
            color: #f1f5f9;
          }
          .dark .vis-grid.vis-minor {
            border-color: #334155;
          }
          .dark .vis-grid.vis-major {
            border-color: #475569;
          }
        `}</style>

        <div ref={containerRef} className="w-full" />
      </div>
    </div>
  );
}
