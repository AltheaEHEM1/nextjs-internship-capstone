"use client";

import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header/PageHeader";

// Sample burndown data (day vs remaining tasks)
const sampleData = [
	{ day: 0, remaining: 50, ideal: 50 },
	{ day: 1, remaining: 45, ideal: 43.75 },
	{ day: 2, remaining: 38, ideal: 37.5 },
	{ day: 3, remaining: 30, ideal: 31.25 },
	{ day: 4, remaining: 25, ideal: 25 },
	{ day: 5, remaining: 18, ideal: 18.75 },
	{ day: 6, remaining: 12, ideal: 12.5 },
	{ day: 7, remaining: 5, ideal: 6.25 },
	{ day: 8, remaining: 0, ideal: 0 },
];

const CustomTooltip = ({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: { color: string; name: string; value: number }[];
	label?: string | number;
}) => {
	if (active && payload?.length) {
		return (
			<div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
				<p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
					Sprint Day {label}
				</p>
				{payload.map((entry) => (
					<div
						key={entry.name}
						className="flex items-center justify-between gap-4 text-sm"
					>
						<div className="flex items-center gap-2">
							<div
								className="h-2.5 w-2.5 rounded-full"
								style={{ backgroundColor: entry.color }}
							/>
							<span className="text-slate-600 dark:text-slate-300">
								{entry.name}:
							</span>
						</div>
						<span className="font-bold text-slate-800 dark:text-slate-100">
							{entry.value}
						</span>
					</div>
				))}
			</div>
		);
	}
	return null;
};

export default function BurndownChartPage() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Burndown Chart"
				description="Project progress tracking"
			/>
			<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:ring-white/10">
				<ResponsiveContainer width="100%" height={450}>
					<LineChart
						data={sampleData}
						margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#e2e8f0"
							vertical={false}
						/>
						<XAxis
							dataKey="day"
							stroke="#94a3b8"
							tick={{ fill: "#64748b", fontSize: 13 }}
							tickLine={false}
							axisLine={false}
							dy={10}
							label={{
								value: "Sprint Days",
								position: "insideBottom",
								offset: -15,
								fill: "#64748b",
								fontSize: 14,
							}}
						/>
						<YAxis
							stroke="#94a3b8"
							tick={{ fill: "#64748b", fontSize: 13 }}
							tickLine={false}
							axisLine={false}
							dx={-10}
							label={{
								value: "Remaining Tasks",
								angle: -90,
								position: "insideLeft",
								fill: "#64748b",
								fontSize: 14,
								dy: 60,
							}}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{
								stroke: "#cbd5e1",
								strokeWidth: 1,
								strokeDasharray: "5 5",
							}}
						/>
						<Legend
							verticalAlign="top"
							height={36}
							iconType="circle"
							wrapperStyle={{ fontSize: "14px", fontWeight: 500 }}
						/>
						<Line
							type="monotone"
							name="Ideal Progress"
							dataKey="ideal"
							stroke="#94a3b8"
							strokeWidth={2}
							strokeDasharray="5 5"
							dot={false}
							activeDot={false}
							animationDuration={1500}
						/>
						<Line
							type="monotone"
							name="Actual Remaining Tasks"
							dataKey="remaining"
							stroke="#0ea5e9"
							strokeWidth={4}
							dot={{ r: 5, strokeWidth: 2, fill: "#ffffff" }}
							activeDot={{ r: 8, strokeWidth: 0, fill: "#0ea5e9" }}
							animationDuration={1500}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
