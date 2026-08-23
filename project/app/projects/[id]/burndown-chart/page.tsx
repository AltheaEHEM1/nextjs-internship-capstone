"use client";

import {
	CartesianGrid,
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
	{ day: 0, remaining: 50 },
	{ day: 1, remaining: 45 },
	{ day: 2, remaining: 38 },
	{ day: 3, remaining: 30 },
	{ day: 4, remaining: 25 },
	{ day: 5, remaining: 18 },
	{ day: 6, remaining: 12 },
	{ day: 7, remaining: 5 },
	{ day: 8, remaining: 0 },
];

export default function BurndownChartPage() {
	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Burndown Chart"
				description="Project progress tracking"
			/>
			<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
				<ResponsiveContainer width="100%" height={400}>
					<LineChart
						data={sampleData}
						margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="day"
							label={{
								value: "Day",
								position: "insideBottomRight",
								offset: -5,
							}}
						/>
						<YAxis
							label={{
								value: "Remaining Tasks",
								angle: -90,
								position: "insideLeft",
							}}
						/>
						<Tooltip />
						<Line
							type="monotone"
							dataKey="remaining"
							stroke="#1e9b65"
							strokeWidth={3}
							dot={{ r: 4 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
