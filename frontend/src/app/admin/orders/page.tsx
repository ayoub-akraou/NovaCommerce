"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, updateAdminOrderStatus } from "@/features/admin/orders/api";
import type { AdminOrder, ListAdminOrdersResponse, OrderStatus } from "@/features/admin/orders/types";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<AdminOrder[]>([]);
	const [meta, setMeta] = useState<ListAdminOrdersResponse["meta"] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<"" | OrderStatus>("");
	const [page, setPage] = useState(1);
	const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

	useEffect(() => {
		async function loadOrders() {
			setLoading(true);
			setError(null);
			try {
				const data = await getAdminOrders({
					page,
					limit: 10,
					status: statusFilter || undefined,
				});
				setOrders(data.items);
				setMeta(data.meta);
			} catch {
				setError("Impossible de charger les commandes admin.");
			} finally {
				setLoading(false);
			}
		}

		void loadOrders();
	}, [page, statusFilter]);

	async function handleUpdateStatus(orderId: string, status: OrderStatus) {
		setUpdatingOrderId(orderId);
		setError(null);
		try {
			const updated = await updateAdminOrderStatus(orderId, status);
			setOrders((current) => current.map((order) => (order.id === updated.id ? { ...order, ...updated } : order)));
		} catch {
			setError("La mise a jour du statut a echoue.");
		} finally {
			setUpdatingOrderId(null);
		}
	}

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-bold">Gestion des commandes</h1>
				<div className="flex items-center gap-2">
					<label htmlFor="status-filter" className="text-sm text-zinc-600">
						Statut
					</label>
					<select
						id="status-filter"
						value={statusFilter}
						onChange={(e) => {
							setPage(1);
							setStatusFilter(e.target.value as "" | OrderStatus);
						}}
						className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
						<option value="">Tous</option>
						{ORDER_STATUSES.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
			</div>

			{error && (
				<p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
					{error}
				</p>
			)}

			{loading ? (
				<div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">Chargement...</div>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-zinc-50">
							<tr>
								<th className="px-4 py-3 font-semibold text-zinc-600">Order ID</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Client</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Total</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Statut</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Cree le</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order.id} className="border-t border-zinc-100">
									<td className="px-4 py-3 font-medium text-zinc-700">{order.id.slice(0, 8)}</td>
									<td className="px-4 py-3 text-zinc-600">{order.user.email}</td>
									<td className="px-4 py-3 text-zinc-800">{Number(order.total).toFixed(2)} MAD</td>
									<td className="px-4 py-3">
										<select
											value={order.status}
											onChange={(e) => void handleUpdateStatus(order.id, e.target.value as OrderStatus)}
											disabled={updatingOrderId === order.id}
											className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60">
											{ORDER_STATUSES.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
									</td>
									<td className="px-4 py-3 text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{meta && (
				<div className="flex items-center justify-end gap-2">
					<button
						type="button"
						onClick={() => setPage((current) => Math.max(1, current - 1))}
						disabled={page <= 1}
						className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50">
						Prev
					</button>
					<span className="text-sm text-zinc-600">
						Page {meta.page} / {meta.totalPages}
					</span>
					<button
						type="button"
						onClick={() => setPage((current) => (meta.totalPages > current ? current + 1 : current))}
						disabled={meta.page >= meta.totalPages}
						className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50">
						Next
					</button>
				</div>
			)}
		</section>
	);
}
