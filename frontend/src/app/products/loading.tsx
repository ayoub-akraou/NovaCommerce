export default function ProductsLoading() {
	return (
		<section className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
			<div className="h-28 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
			<div className="h-20 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div key={index} className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
				))}
			</div>
		</section>
	);
}
