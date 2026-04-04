"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listShopCategoriesUseCase } from "@/features/shop/products/use-cases";
import type { ShopCategory } from "@/features/shop/products/types";

const COLOR_THEMES = [
	"from-indigo-500 to-violet-500",
	"from-emerald-500 to-teal-500",
	"from-amber-500 to-orange-500",
	"from-sky-500 to-cyan-500",
	"from-fuchsia-500 to-pink-500",
	"from-rose-500 to-red-500",
] as const;

function pickTheme(slug: string): string {
	const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return COLOR_THEMES[hash % COLOR_THEMES.length];
}

function getInitials(name: string): string {
	const words = name.trim().split(/\s+/).slice(0, 2);
	return words.map((word) => word[0]?.toUpperCase() ?? "").join("") || "C";
}

export function HomeCategoriesStrip() {
	const [categories, setCategories] = useState<ShopCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadCategories() {
			setLoading(true);
			setError(null);
			try {
				const data = await listShopCategoriesUseCase();
				setCategories(data);
			} catch {
				setError("Impossible de charger les categories.");
				setCategories([]);
			} finally {
				setLoading(false);
			}
		}

		void loadCategories();
	}, []);

	const cards = useMemo(() => {
		return categories.map((category) => ({
			...category,
			theme: pickTheme(category.slug),
			initials: getInitials(category.name),
		}));
	}, [categories]);

	if (loading) {
		return (
			<div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className="h-36 w-52 shrink-0 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100" />
				))}
			</div>
		);
	}

	if (error) {
		return <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>;
	}

	if (cards.length === 0) {
		return <p className="text-sm text-zinc-500">Aucune categorie pour le moment.</p>;
	}

	return (
		<div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
			{cards.map((category) => (
				<Link
					key={category.id}
					href={`/products?category=${category.id}`}
					className="group snap-start w-56 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
				>
					<div className={`h-24 bg-gradient-to-br ${category.theme} p-4`}>
						<div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-sm font-bold text-white backdrop-blur-sm">
							{category.initials}
						</div>
					</div>
					<div className="space-y-1 p-4">
						<h3 className="line-clamp-1 text-sm font-semibold text-zinc-900">{category.name}</h3>
						<p className="text-xs text-zinc-500">Voir les produits</p>
					</div>
				</Link>
			))}
		</div>
	);
}
