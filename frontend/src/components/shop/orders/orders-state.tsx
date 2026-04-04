import Link from "next/link";
import type { ShopOrder } from "@/features/shop/orders/types";

type OrdersStateProps = {
	loading: boolean;
	error: string | null;
	orders: ShopOrder[];
	isLoggedIn: boolean;
};

export function OrdersState({ loading, error, orders, isLoggedIn }: OrdersStateProps) {
	if (loading) {
		return <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">Loading orders...</div>;
	}

	if (!isLoggedIn) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
				<h1 className="text-xl font-semibold text-zinc-900">Login required</h1>
				<p className="mt-2 text-sm text-zinc-600">Please login to see your orders.</p>
				<Link href="/login" className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
					Go to login
				</Link>
			</div>
		);
	}

	if (error) {
		return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
	}

	if (orders.length === 0) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
				<h1 className="text-xl font-semibold text-zinc-900">No orders yet</h1>
				<p className="mt-2 text-sm text-zinc-600">Place your first order from the shop.</p>
				<Link href="/products" className="mt-4 inline-flex rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
					Browse products
				</Link>
			</div>
		);
	}

	return null;
}
