"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/shop/orders/order-status-badge";
import { OrdersState } from "@/components/shop/orders/orders-state";
import { cancelMyOrderUseCase, getMyOrdersUseCase } from "@/features/shop/orders/use-cases";
import type { ShopOrder } from "@/features/shop/orders/types";
import { useAuthStore } from "@/store/auth.store";

export default function OrdersPage() {
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state.hasHydrated);

	const [orders, setOrders] = useState<ShopOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionInfo, setActionInfo] = useState<string | null>(null);
	const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) {
			setOrders([]);
			setLoading(false);
			return;
		}

		async function loadOrders() {
			setLoading(true);
			setError(null);
			try {
				const data = await getMyOrdersUseCase();
				setOrders(data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.response?.data?.message ?? "Impossible de charger l'historique.");
				} else {
					setError("Impossible de charger l'historique.");
				}
				setOrders([]);
			} finally {
				setLoading(false);
			}
		}

		void loadOrders();
	}, [hasHydrated, user]);

	if (!hasHydrated || loading || !user || error || orders.length === 0) {
		return (
			<section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900">Historique commandes</h1>
					<Link href="/products" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
						Continuer shopping
					</Link>
				</div>
				<OrdersState loading={!hasHydrated || loading} error={error} orders={orders} isLoggedIn={Boolean(user)} />
			</section>
		);
	}

	return (
		<section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-zinc-900">Historique commandes</h1>
				<Link href="/products" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
					Continuer shopping
				</Link>
			</div>
			{actionInfo && (
				<p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
					{actionInfo}
				</p>
			)}
			{error && (
				<p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
					{error}
				</p>
			)}

			<div className="grid gap-4">
				{orders.map((order) => {
					const canPay = order.status === "PENDING";
					return (
						<article key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Commande</p>
									<p className="text-sm font-semibold text-zinc-900">{order.id}</p>
								</div>
								<div className="flex items-center gap-2">
									<OrderStatusBadge status={order.status} />
									{canPay && (
										<button
											type="button"
											aria-label="Cancel order"
											onClick={async () => {
												setActionInfo(null);
												setError(null);
												setCancellingOrderId(order.id);
												try {
													await cancelMyOrderUseCase(order.id);
													setOrders((prev) => prev.filter((o) => o.id !== order.id));
													setActionInfo("Commande annulee.");
												} catch (err) {
													if (axios.isAxiosError(err)) {
														setError(err.response?.data?.message ?? "Impossible d'annuler.");
													} else {
														setError("Impossible d'annuler.");
													}
												} finally {
													setCancellingOrderId(null);
												}
											}}
											disabled={cancellingOrderId === order.id}
											className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-300 bg-white text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
												<path d="M6 6l12 12" />
												<path d="M18 6L6 18" />
											</svg>
										</button>
									)}
								</div>
							</div>

							<div className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2 lg:grid-cols-4">
								<p>
									<span className="font-semibold text-zinc-900">Total:</span> {Number(order.total).toFixed(2)} MAD
								</p>
								<p>
									<span className="font-semibold text-zinc-900">Articles:</span> {order.items.length}
								</p>
								<p>
									<span className="font-semibold text-zinc-900">Adresse:</span> {order.address}
								</p>
								<p>
									<span className="font-semibold text-zinc-900">Date:</span> {new Date(order.createdAt).toLocaleString()}
								</p>
							</div>

							<div className="mt-4">
								{canPay ? (
									<Link href={`/payment/${order.id}`} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
										Payer maintenant
									</Link>
								) : (
									<span className="rounded-xl bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600">Deja payee</span>
								)}
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}

