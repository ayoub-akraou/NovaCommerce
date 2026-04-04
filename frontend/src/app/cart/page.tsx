"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItemRow } from "@/components/shop/cart/cart-item-row";
import { CartState } from "@/components/shop/cart/cart-state";
import { CartSummary } from "@/components/shop/cart/cart-summary";
import {
	clearCartUseCase,
	getMyCartUseCase,
	removeCartItemUseCase,
	updateCartItemQuantityUseCase,
} from "@/features/shop/cart/use-cases";
import type { Cart, CartItem } from "@/features/shop/cart/types";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export default function CartPage() {
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state.hasHydrated);
	const setFromCart = useCartStore((state) => state.setFromCart);
	const clearCartCount = useCartStore((state) => state.clearCart);

	const [cart, setCart] = useState<Cart | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
	const [clearing, setClearing] = useState(false);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) {
			setLoading(false);
			setCart(null);
			clearCartCount();
			return;
		}

		async function loadCart() {
			setLoading(true);
			setError(null);
			try {
				const loadedCart = await getMyCartUseCase();
				setCart(loadedCart);
				setFromCart(loadedCart);
			} catch {
				setError("Impossible de charger le panier.");
				setCart(null);
				clearCartCount();
			} finally {
				setLoading(false);
			}
		}

		void loadCart();
	}, [hasHydrated, user, setFromCart, clearCartCount]);

	async function handleUpdateQuantity(item: CartItem, nextQuantity: number) {
		setUpdatingItemId(item.id);
		setFeedback(null);
		try {
			const updated = await updateCartItemQuantityUseCase({
				itemId: item.id,
				quantity: nextQuantity,
			});
			setCart(updated);
			setFromCart(updated);
		} catch {
			setFeedback("Impossible de modifier la quantite.");
		} finally {
			setUpdatingItemId(null);
		}
	}

	async function handleRemove(item: CartItem) {
		setUpdatingItemId(item.id);
		setFeedback(null);
		try {
			const updated = await removeCartItemUseCase(item.id);
			setCart(updated);
			setFromCart(updated);
		} catch {
			setFeedback("Suppression echouee.");
		} finally {
			setUpdatingItemId(null);
		}
	}

	async function handleClearCart() {
		if (!cart || cart.items.length === 0) return;
		setClearing(true);
		setFeedback(null);
		try {
			const updated = await clearCartUseCase(cart);
			setCart(updated);
			setFromCart(updated);
		} catch {
			setFeedback("Impossible de vider le panier.");
		} finally {
			setClearing(false);
		}
	}

	if (!hasHydrated) {
		return (
			<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">Chargement...</div>
			</section>
		);
	}

	if (!user) {
		return (
			<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
					<h1 className="text-xl font-semibold text-zinc-900">Connecte-toi pour voir ton panier</h1>
					<p className="mt-2 text-sm text-zinc-600">Le panier est lie a ton compte utilisateur.</p>
					<div className="mt-4 flex items-center justify-center gap-3">
						<Link href="/login" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
							Login
						</Link>
						<Link href="/products" className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
							Continuer les achats
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-zinc-900">Mon panier</h1>
				<Link href="/products" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
					← Continuer les achats
				</Link>
			</div>

			{feedback && (
				<p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{feedback}</p>
			)}

			<CartState loading={loading} error={error} cart={cart} />

			{cart && cart.items.length > 0 && (
				<div className="grid gap-6 lg:grid-cols-[1fr_300px]">
					<div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
						<table className="min-w-full text-left">
							<thead className="bg-zinc-50">
								<tr>
									<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Produit</th>
									<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Prix</th>
									<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Quantite</th>
									<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Total</th>
									<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">Action</th>
								</tr>
							</thead>
							<tbody>
								{cart.items.map((item) => (
									<CartItemRow
										key={item.id}
										item={item}
										updating={updatingItemId === item.id}
										onDecrease={(currentItem) => void handleUpdateQuantity(currentItem, Math.max(1, currentItem.quantity - 1))}
										onIncrease={(currentItem) => void handleUpdateQuantity(currentItem, Math.min(currentItem.product.stock, currentItem.quantity + 1))}
										onRemove={(currentItem) => void handleRemove(currentItem)}
									/>
								))}
							</tbody>
						</table>
					</div>

					<CartSummary cart={cart} clearing={clearing} onClear={() => void handleClearCart()} />
				</div>
			)}
		</section>
	);
}