import { PageHeader } from "@/components/page-header/PageHeader";

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Profile"
				description="Manage your profile information and settings"
			/>

			{/* Implementation Tasks Banner */}
			<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
				<h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
					⚙️ Settings Implementation Tasks
				</h3>
				<ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
					<li>• Task 2.4: Implement user session management</li>
					<li>
						• Task 6.4: Implement project member management and permissions
					</li>
				</ul>
			</div>

			{/* Settings Content */}
			<div className="lg:col-span-2 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
				<h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-6">
					Profile Settings
				</h3>

				<div className="space-y-6">
					<div>
						<label
							htmlFor="full-name"
							className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2"
						>
							Full Name
						</label>
						<input
							type="text"
							id="full-name"
							defaultValue="John Doe"
							className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							defaultValue="john@example.com"
							className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
						/>
					</div>

					<div>
						<label
							htmlFor="role"
							className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2"
						>
							Role
						</label>
						<select
							id="role"
							className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
						>
							<option>Project Manager</option>
							<option>Developer</option>
							<option>Designer</option>
							<option>QA Engineer</option>
						</select>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							className="px-4 py-2 text-payne's_gray-500 dark:text-french_gray-400 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors"
						>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
