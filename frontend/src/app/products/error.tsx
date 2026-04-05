"use client";

type ProductsErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ProductsError({ reset }: ProductsErrorProps) {
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
				<h1 className="text-lg font-semibold text-rose-800">Impossible de charger les produits</h1>
				<p className="mt-2 text-sm text-rose-700">Verifie que le backend est actif puis reessaie.</p>
				<button
					type="button"
					onClick={reset}
					className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
				>
					Reessayer
				</button>
			</div>
		</section>
	);
}
