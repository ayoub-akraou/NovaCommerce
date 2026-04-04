"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/shop/orders/order-status-badge";
import { OrdersState } from "@/components/shop/orders/orders-state";
import { getMyOrdersUseCase } from "@/features/shop/orders/use-cases";
import type { ShopOrder } from "@/features/shop/orders/types";
import { useAuthStore } from "@/store/auth.store";

export default function OrdersPage() {
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state.hasHydrated);

	const [orders, setOrders] = useState<ShopOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

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
					setError(err.response?.data?.message ?? "Unable to load orders.");
				} else {
					setError("Unable to load orders.");
				}
				setOrders([]);
			} finally {
				setLoading(false);
			}
		}

		void loadOrders();
	}, [hasHydrated, user]);

	const stateBlock = (
		<OrdersState
			loading={!hasHydrated || loading}
			error={error}
			orders={orders}
			isLoggedIn={Boolean(user)}
		/>
	);

	if (!hasHydrated || loading || !user || error || orders.length === 0) {
		return (
			<section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900">My orders</h1>
					<Link href="/products" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
						Continue shopping
					</Link>
				</div>
				{stateBlock}
			</section>
		);
	}

	return (
		<section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-zinc-900">My orders</h1>
				<Link href="/products" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
					Continue shopping
				</Link>
			</div>

			{info && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{info}</p>}

			<div className="grid gap-4">
				{orders.map((order) => {
					const canPay = order.status === "PENDING";
					return (
						<article key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Order</p>
									<p className="text-sm font-semibold text-zinc-900">{order.id}</p>
								</div>
								<div className="flex items-center gap-2">
									<OrderStatusBadge status={order.status} />
									<button
										type="button"
										aria-label="Delete order"
										onClick={() => setInfo("Delete order is not available yet in backend API. We can add it next.")}
										className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-300 bg-white text-rose-600 transition hover:bg-rose-50"
									>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
											<path d="M6 6l12 12" />
											<path d="M18 6L6 18" />
										</svg>
									</button>
								</div>
							</div>

							<div className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2 lg:grid-cols-4">
								<p>
									<span className="font-semibold text-zinc-900">Total:</span> {Number(order.total).toFixed(2)} MAD
								</p>
								<p>
									<span className="font-semibold text-zinc-900">Items:</span> {order.items.length}
								</p>
								<p>
									<span className="font-semibold text-zinc-900">Address:</span> {order.address}
								</p>
								<p>
									<span className="font-semibold text-zinc-900">Created:</span>{" "}
									{new Date(order.createdAt).toLocaleString()}
								</p>
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								{canPay ? (
									<Link
										href={`/payment/${order.id}`}
										className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
									>
										Pay now
									</Link>
								) : (
									<span className="rounded-xl bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600">
										Already paid
									</span>
								)}
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
