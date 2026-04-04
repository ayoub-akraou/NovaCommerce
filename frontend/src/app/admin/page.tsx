"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/products/product-card";
import { type AdminStatsResponse } from "@/features/admin/stats/api";
import type { ShopProduct } from "@/features/shop/products/types";
import { getShopProductDetailsUseCase } from "@/features/shop/products/use-cases";
import { getAdminStatsUseCase } from "@/features/admin/stats/use-cases";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<AdminStatsResponse | null>(null);
	const [topProductDetails, setTopProductDetails] = useState<Record<string, ShopProduct>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			setError(null);
			try {
				const data = await getAdminStatsUseCase();
				setStats(data);

				const topProductsEntries = await Promise.all(
					data.topProducts.map(async (item) => {
						const details = await getShopProductDetailsUseCase(item.productId);
						return [item.productId, details] as const;
					}),
				);

				setTopProductDetails(
					Object.fromEntries(
						topProductsEntries.filter((entry): entry is [string, ShopProduct] => Boolean(entry[1])),
					),
				);
			} catch {
				setError("Impossible de charger les statistiques admin.");
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	if (loading) return <div className="mx-auto max-w-6xl p-6">Chargement...</div>;
	if (error) return <div className="mx-auto max-w-6xl p-6 text-rose-600">{error}</div>;
	if (!stats) return null;

	return (
		<section className="mx-auto max-w-6xl space-y-6 p-6">
			<h1 className="text-2xl font-bold">Dashboard Admin</h1>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card title="Total ventes" value={`${stats.totalSales.toFixed(2)} MAD`} />
				<Card title="Commandes payees" value={String(stats.totalOrders)} />
				<Card title="Panier moyen" value={`${stats.averageBasket.toFixed(2)} MAD`} />
				<Card title="Produits stock faible" value={String(stats.lowStockProducts)} />
			</div>

			<div className="rounded-2xl border border-zinc-200 bg-white p-4">
				<h2 className="mb-3 text-lg font-semibold">Top produits</h2>
				{stats.topProducts.length === 0 ? (
					<p className="text-sm text-zinc-500">Aucun produit vendu pour le moment.</p>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{stats.topProducts.map((item) => (
							<div key={item.productId} className="space-y-2">
								<ProductCard product={topProductDetails[item.productId] ?? toShopProduct(item)} />
								<p className="text-xs font-semibold text-zinc-600">
									Quantite vendue: {item.quantitySold}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

function toShopProduct(
	item: AdminStatsResponse["topProducts"][number],
): ShopProduct {
	return {
		id: item.product?.id ?? item.productId,
		categoryId: "",
		title: item.product?.title ?? "Produit inconnu",
		slug: item.product?.slug ?? item.productId,
		description: "Top produit le plus vendu.",
		price: "0",
		stock: 0,
		images: [],
		createdAt: "",
		updatedAt: "",
		category: {
			id: "",
			name: "Top produit",
			slug: "top-product",
		},
	};
}

function Card({ title, value }: { title: string; value: string }) {
	return (
		<div className="rounded-2xl border border-zinc-200 bg-white p-4">
			<p className="text-sm text-zinc-500">{title}</p>
			<p className="mt-1 text-xl font-bold">{value}</p>
		</div>
	);
}
