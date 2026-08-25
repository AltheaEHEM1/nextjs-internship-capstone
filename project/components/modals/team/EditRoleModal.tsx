"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import BaseModal from "@/components/layout/BaseModal";

interface EditRoleModalProps {
	opened: boolean;
	memberName: string;
	currentRole: string;
	currentPermission: string;
	loading: boolean;
	onClose: () => void;
	onSubmit: (newRole: string, newPermission: string) => void;
}

export default function EditRoleModal({
	opened,
	memberName,
	currentRole,
	currentPermission,
	loading,
	onClose,
	onSubmit,
}: EditRoleModalProps) {
	const [role, setRole] = useState(currentRole);
	const [permission, setPermission] = useState(currentPermission);
	const [maxLengthError, setMaxLengthError] = useState("");

	useEffect(() => {
		if (opened) {
			setRole(currentRole);
			setPermission(currentPermission);
		}
	}, [opened, currentRole, currentPermission]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!role.trim()) return;
		onSubmit(role, permission);
	};

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={400}
			title={
				<div className="flex items-center gap-2">
					<Pencil size={20} className="text-blue_munsell-500" />
					<span>Edit {memberName || "Member"}</span>
				</div>
			}
		>
			<form onSubmit={handleSubmit} className="space-y-4 pt-2">
				<div>
					<label
						htmlFor="role"
						className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
					>
						Role
					</label>
					<input
						id="role"
						type="text"
						value={role}
						onChange={(e) => {
							let val = e.target.value.replace(/\s{2,}/g, " ");
							if (val.length > 20) {
								val = val.slice(0, 20);
								setMaxLengthError("Role is too long");
							} else {
								setMaxLengthError("");
							}
							setRole(val);
						}}
						disabled={loading}
						placeholder="e.g. Developer, Designer..."
						className={`mt-1 w-full rounded-xl border p-2.5 text-sm outline-hidden dark:bg-outer_space-400 dark:text-platinum-100 ${maxLengthError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-french_gray-200 focus:border-blue_munsell-400 dark:border-paynes_gray-600"}`}
					/>
					{maxLengthError && (
						<p className="mt-1 text-xs text-red-500 font-medium">
							{maxLengthError}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="permission"
						className="block text-xs font-medium text-outer_space-500 dark:text-platinum-300"
					>
						Permission
					</label>
					<select
						id="permission"
						value={permission}
						onChange={(e) => setPermission(e.target.value)}
						disabled={loading}
						className="mt-1 w-full rounded-xl border border-french_gray-200 p-2.5 text-sm outline-hidden focus:border-blue_munsell-400 dark:border-paynes_gray-600 dark:bg-outer_space-400 dark:text-platinum-100"
					>
						<option value="administrator">Admin</option>
						<option value="member">Member</option>
						<option value="viewer">Viewer</option>
					</select>
				</div>
				<div className="flex justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="rounded-xl px-4 py-2 text-xs font-semibold text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 dark:hover:bg-outer_space-600 transition-colors disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading || !role.trim()}
						className="rounded-xl bg-blue_munsell-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue_munsell-600 transition-colors disabled:opacity-50"
					>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</BaseModal>
	);
}
