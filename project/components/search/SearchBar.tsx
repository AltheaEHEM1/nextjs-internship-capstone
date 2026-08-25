"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
	className = "",
}: SearchBarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleToggle = () => {
		if (isOpen && value) {
			onChange("");
		}
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	return (
		<div className={`relative flex items-center ${className}`}>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? "w-64 opacity-100 mr-2" : "w-0 opacity-0"
				}`}
			>
				<input
					ref={inputRef}
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full rounded-lg border border-french_gray-300 bg-white px-3.5 py-2 text-sm text-outer_space-700 shadow-2xs focus:border-blue_munsell-500 focus:outline-none dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200"
				/>
			</div>

			<button
				type="button"
				onClick={handleToggle}
				className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-french_gray-300 bg-white text-outer_space-700 shadow-2xs transition-colors hover:bg-french_gray-50 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-payne's_gray-400"
				aria-label="Toggle search"
			>
				<Search size={18} />
			</button>
		</div>
	);
}
