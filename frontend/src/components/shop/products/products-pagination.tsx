type ProductsPaginationProps = {
	page: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
};

export function ProductsPagination({ page, totalPages, onPrevious, onNext }: ProductsPaginationProps) {
	return (
		<div className="flex items-center justify-end gap-2">
			<button
				type="button"
				onClick={onPrevious}
				disabled={page <= 1}
				className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Previous
			</button>
			<p className="px-2 text-sm text-zinc-600">
				Page {page} / {totalPages}
			</p>
			<button
				type="button"
				onClick={onNext}
				disabled={page >= totalPages}
				className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Next
			</button>
		</div>
	);
}
