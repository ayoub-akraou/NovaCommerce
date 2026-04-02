"use client";

import type { ReactNode } from "react";

type SimpleModalProps = {
	open: boolean;
	title: string;
	onClose: () => void;
	children: ReactNode;
};

export function SimpleModal({ open, title, onClose, children }: SimpleModalProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close modal"
				onClick={onClose}
				className="absolute inset-0 bg-black/45"
			/>
			<div className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl">
				<div className="mb-4 flex items-center justify-between gap-3">
					<h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
					>
						Fermer
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
