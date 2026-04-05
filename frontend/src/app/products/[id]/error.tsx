"use client";

import Link from "next/link";

type ProductDetailsErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ProductDetailsError({ reset }: ProductDetailsErrorProps) {
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
				<h1 className="text-lg font-semibold text-rose-800">Impossible de charger ce produit</h1>
				<p className="mt-2 text-sm text-rose-700">Le produit est peut-etre indisponible ou le backend ne repond pas.</p>
				<div className="mt-4 flex items-center gap-2">
					<button
						type="button"
						onClick={reset}
						className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
					>
						Reessayer
					</button>
					<Link href="/products" className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
						Retour produits
					</Link>
				</div>
			</div>
		</section>
	);
}
