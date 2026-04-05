export default function ProductDetailsLoading() {
	return (
		<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
			<div className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-6 lg:grid-cols-2">
				<div className="h-96 animate-pulse rounded-2xl bg-zinc-100" />
				<div className="space-y-3">
					<div className="h-6 w-28 animate-pulse rounded bg-zinc-200" />
					<div className="h-10 w-4/5 animate-pulse rounded bg-zinc-200" />
					<div className="h-8 w-40 animate-pulse rounded bg-zinc-200" />
					<div className="h-24 w-full animate-pulse rounded bg-zinc-100" />
					<div className="h-11 w-44 animate-pulse rounded bg-zinc-200" />
				</div>
			</div>
		</section>
	);
}
