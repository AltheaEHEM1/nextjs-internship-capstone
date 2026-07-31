import { MoreHorizontal } from "lucide-react";

export default async function Board() {
	const kanbanColumns = ["To Do", "In Progress", "Review", "Done"];

	return (
		<div className="flex gap-6 overflow-x-auto py-6">
			{kanbanColumns.map((columnTitle) => (
				<div key={columnTitle} className="w-72 flex-shrink-0 sm:w-80">
					<div className="rounded-xl border border-french_gray-200 bg-platinum-100 dark:border-payne's_gray-600 dark:bg-outer_space-500">
						{/* Column Header */}
						<div className="border-b border-french_gray-200 p-4 dark:border-payne's_gray-600">
							<div className="flex items-center justify-between">
								<h3 className="flex items-center font-semibold text-outer_space-700 dark:text-platinum-200">
									{columnTitle}
									<span className="ml-2 rounded-full bg-french_gray-200 px-2.5 py-0.5 text-xs text-outer_space-600 dark:bg-payne's_gray-500 dark:text-platinum-300">
										{Math.floor(Math.random() * 4) + 1}
									</span>
								</h3>
								<button className="rounded-lg p-1 text-outer_space-400 hover:bg-french_gray-200 dark:text-platinum-400 dark:hover:bg-payne's_gray-400">
									<MoreHorizontal size={16} />
								</button>
							</div>
						</div>

						{/* Task Cards Container */}
						<div className="min-h-[350px] space-y-3 p-4">
							{[1, 2, 3].map((taskIndex) => (
								<div
									key={taskIndex}
									className="group cursor-pointer rounded-lg border border-french_gray-200 bg-white p-4 shadow-xs transition-all hover:border-blue_munsell-400 hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-400 dark:hover:border-blue_munsell-500"
								>
									<h4 className="mb-1 text-sm font-semibold text-outer_space-700 dark:text-platinum-200">
										Design System Update #{taskIndex}
									</h4>
									<p className="mb-3 line-clamp-2 text-xs text-outer_space-400 dark:text-platinum-400">
										Refactor color tokens and component documentation for the
										layout migration.
									</p>
									<div className="flex items-center justify-between pt-2">
										<span className="rounded-md bg-blue_munsell-50 px-2 py-0.5 text-xs font-medium text-blue_munsell-700 dark:bg-blue_munsell-950 dark:text-blue_munsell-300">
											Medium
										</span>
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue_munsell-500 text-xs font-semibold text-white shadow-xs">
											U
										</div>
									</div>
								</div>
							))}

							{/* Add Task Button */}
							<button className="w-full rounded-lg border-2 border-dashed border-french_gray-300 py-2.5 text-sm font-medium text-outer_space-500 transition-colors hover:border-blue_munsell-500 hover:bg-blue_munsell-50/50 hover:text-blue_munsell-600 dark:border-payne's_gray-500 dark:text-platinum-400 dark:hover:bg-blue_munsell-950/20 dark:hover:text-blue_munsell-400">
								+ Add task
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
