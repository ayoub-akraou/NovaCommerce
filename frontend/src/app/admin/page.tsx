"use client";

import { useEffect, useState } from "react";
import { type AdminStatsResponse } from "@/features/admin/stats/api";
import { getAdminStatsUseCase } from "@/features/admin/stats/use-cases";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<AdminStatsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			setError(null);
			try {
				const data = await getAdminStatsUseCase();
				setStats(data);
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
					<ul className="space-y-2">
						{stats.topProducts.map((item) => (
							<li key={item.productId} className="flex items-center justify-between text-sm">
								<span>{item.product?.title ?? "Produit inconnu"}</span>
								<span className="font-semibold">{item.quantitySold}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}

function Card({ title, value }: { title: string; value: string }) {
	return (
		<div className="rounded-2xl border border-zinc-200 bg-white p-4">
			<p className="text-sm text-zinc-500">{title}</p>
			<p className="mt-1 text-xl font-bold">{value}</p>
		</div>
	);
}
