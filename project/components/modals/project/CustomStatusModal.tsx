"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	ArrowLeft,
	CheckCircle2,
	CircleDot,
	GripVertical,
	MoreHorizontal,
	Plus,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import BaseModal from "@/components/layout/BaseModal";
import { useSortableItem } from "@/hooks/components/useSortableItem";
import { useCustomStatusStore } from "../../../stores/project/CustomStatusStore";

type StatusCategory = "notStarted" | "active" | "done" | "closed";

interface SortableStatusItemProps {
	category: StatusCategory;
	index: number;
	item: string;
	onRemove: () => void;
}

function SortableStatusItem({
	category,
	index,
	item,
	onRemove,
}: SortableStatusItemProps) {
	const id = `${category}:${index}:${item}`;
	const { setNodeRef, attributes, listeners, isDragging, style } =
		useSortableItem({
			id,
			data: {
				type: "StatusItem",
				category,
				index,
				item,
			},
		});

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center justify-between rounded-lg border border-gray-200 bg-gray-300 px-4 py-2.5 shadow-xs ${
				isDragging ? "opacity-60 shadow-lg ring-2 ring-[#1e9b65]/40" : ""
			}`}
		>
			<div className="flex items-center gap-3">
				<span
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700"
				>
					<GripVertical size={16} />
				</span>
				{category === "done" || category === "closed" ? (
					<CheckCircle2 size={16} className="text-emerald-500" />
				) : (
					<CircleDot size={16} className="text-indigo-400" />
				)}
				<span className="text-xs font-bold tracking-wide text-gray uppercase">
					{item}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onRemove}
					className="text-gray-500 hover:text-red-400"
				>
					<Trash2 size={14} />
				</button>
				<MoreHorizontal size={16} className="text-gray-500" />
			</div>
		</div>
	);
}

function StatusItemDisplay({
	category,
	item,
}: {
	category: StatusCategory;
	item: string;
}) {
	return (
		<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-300 px-4 py-2.5 shadow-lg opacity-80">
			<span className="text-gray-500">
				<GripVertical size={16} />
			</span>
			{category === "done" || category === "closed" ? (
				<CheckCircle2 size={16} className="text-emerald-500" />
			) : (
				<CircleDot size={16} className="text-indigo-400" />
			)}
			<span className="text-xs font-bold tracking-wide text-gray uppercase">
				{item}
			</span>
		</div>
	);
}

function parseItemId(id: string | number) {
	const parts = String(id).split(":");
	const category = parts[0] as StatusCategory;
	const fromIndex = Number(parts[1]);
	const item = parts.slice(2).join(":");
	return { category, fromIndex, item };
}

interface CustomStatusProps {
	opened: boolean;
	onClose: () => void;
	onBack?: () => void;
	status: {
		notStarted: string[];
		active: string[];
		done: string[];
		closed: string[];
	};
	onChangeStatus: (status: Record<string, string[]>) => void;
}

export default function CustomStatus({
	opened,
	onClose,
	onBack,
	status,
	onChangeStatus,
}: CustomStatusProps) {
	useEffect(() => {
		useCustomStatusStore.getState().initialize(status, onChangeStatus);
	}, [status, onChangeStatus]);

	const { handleRemove, handleReorder } = useCustomStatusStore();

	const categories = [
		{ key: "notStarted" as const, label: "Not started" },
		{ key: "active" as const, label: "Active" },
		{ key: "done" as const, label: "Done" },
		{ key: "closed" as const, label: "Closed" },
	];

	// Modal state for adding a new status
	const [addModal, setAddModal] = useState<{
		isOpen: boolean;
		category: StatusCategory | null;
		label: string;
		inputValue: string;
	}>({
		isOpen: false,
		category: null,
		label: "",
		inputValue: "",
	});

	const openAddModal = (category: StatusCategory, label: string) => {
		setAddModal({ isOpen: true, category, label, inputValue: "" });
	};

	const closeAddModal = () => {
		setAddModal((prev) => ({ ...prev, isOpen: false }));
	};

	const handleAddStatusSubmit = () => {
		const val = addModal.inputValue.trim();
		if (val && addModal.category) {
			const currentStatusList = status[addModal.category];
			onChangeStatus({
				...status,
				[addModal.category]: [...currentStatusList, val],
			});
		}
		closeAddModal();
	};

	const pointerSensorOptions = useMemo(
		() => ({ activationConstraint: { distance: 5 } }),
		[],
	);
	const sensors = useSensors(useSensor(PointerSensor, pointerSensorOptions));

	const [activeItem, setActiveItem] = useState<
		{ category: StatusCategory; item: string } | undefined
	>(undefined);

	const onDragStart = useCallback((event: DragStartEvent) => {
		const parsed = parseItemId(event.active.id);
		setActiveItem({ category: parsed.category, item: parsed.item });
	}, []);

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			setActiveItem(undefined);
			const { active, over } = event;
			if (!over) return;
			if (active.id === over.id) return;

			const activeParsed = parseItemId(active.id);
			const overParsed = parseItemId(over.id);

			if (activeParsed.category !== overParsed.category) return;

			handleReorder(
				activeParsed.category,
				activeParsed.fromIndex,
				overParsed.fromIndex,
			);
		},
		[handleReorder],
	);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={500}
			title={
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onBack ?? onClose}
						className="rounded-lg p-1 hover:bg-gray-100 transition dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
					>
						<ArrowLeft size={20} />
					</button>
					<span>Task Statuses</span>
				</div>
			}
			footer={
				<button
					type="button"
					onClick={onClose}
					className="w-full rounded-lg bg-[#1e9b65] py-2 text-sm font-medium text-white shadow hover:opacity-95 transition"
				>
					Done
				</button>
			}
		>
			<div className="space-y-6">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
				>
					{categories.map(({ key, label }) => {
						const items = status[key];
						const itemIds = items.map(
							(item, index) => `${key}:${index}:${item}`,
						);
						return (
							<div key={key} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-xs font-semibold tracking-wider text-gray-500">
										{label}
									</span>
									<button
										type="button"
										onClick={() => openAddModal(key, label)}
										className="text-gray-100 hover:text-white"
									>
										<Plus size={16} />
									</button>
								</div>

								<div className="space-y-2">
									<SortableContext
										items={itemIds}
										strategy={verticalListSortingStrategy}
									>
										{items.map((item: string, index: number) => (
											<SortableStatusItem
												key={`${key}:${item}`}
												category={key}
												index={index}
												item={item}
												onRemove={() => handleRemove(key, index)}
											/>
										))}
									</SortableContext>

									<button
										type="button"
										onClick={() => openAddModal(key, label)}
										className="w-full rounded-lg border border-dashed border-gray-700 bg-transparent py-2 text-center text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200 transition"
									>
										+ Add status
									</button>
								</div>
							</div>
						);
					})}

					{activeItem && (
						<DragOverlay>
							<StatusItemDisplay
								category={activeItem.category}
								item={activeItem.item}
							/>
						</DragOverlay>
					)}
				</DndContext>
			</div>

			{/* Add Status Modal */}
			<BaseModal
				opened={addModal.isOpen}
				onClose={closeAddModal}
				width={400}
				title={
					<div className="flex items-center gap-2">
						<Plus size={18} className="text-[#1e9b65]" />
						<span>Add {addModal.label} Status</span>
					</div>
				}
				footer={
					<>
						<button
							type="button"
							onClick={closeAddModal}
							className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition dark:text-gray-300 dark:hover:bg-gray-800"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleAddStatusSubmit}
							disabled={!addModal.inputValue.trim()}
							className="rounded-lg bg-[#1e9b65] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50 transition"
						>
							Add Status
						</button>
					</>
				}
			>
				<div>
					<label
						htmlFor="statusName"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Status Name
					</label>
					<input
						type="text"
						id="statusName"
						value={addModal.inputValue}
						onChange={(e) =>
							setAddModal((prev) => ({ ...prev, inputValue: e.target.value }))
						}
						onKeyDown={(e) => {
							if (e.key === "Enter" && addModal.inputValue.trim()) {
								e.preventDefault();
								handleAddStatusSubmit();
							}
						}}
						placeholder="e.g. In Review"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e9b65] focus:outline-none focus:ring-1 focus:ring-[#1e9b65] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</BaseModal>
		</BaseModal>
	);
}
