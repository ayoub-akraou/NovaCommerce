import Link from "next/link";

type ProductsPaginationProps = {
	page: number;
	totalPages: number;
	previousHref: string | null;
	nextHref: string | null;
};

export function ProductsPagination({
	page,
	totalPages,
	previousHref,
	nextHref,
}: ProductsPaginationProps) {
	return (
		<div className="flex items-center justify-end gap-2">
			{previousHref ? (
				<Link href={previousHref} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
					Previous
				</Link>
			) : (
				<span className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 opacity-50">
					Previous
				</span>
			)}
			<p className="px-2 text-sm text-zinc-600">
				Page {page} / {totalPages}
			</p>
			{nextHref ? (
				<Link href={nextHref} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
					Next
				</Link>
			) : (
				<span className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 opacity-50">
					Next
				</span>
			)}
		</div>
	);
}
