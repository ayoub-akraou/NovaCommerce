"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CartState } from "@/components/shop/cart/cart-state";
import { CheckoutStepper } from "@/components/shop/checkout/checkout-stepper";
import { AppButton } from "@/components/ui/app-button";
import { AppTextarea } from "@/components/ui/app-textarea";
import { getMyCartUseCase } from "@/features/shop/cart/use-cases";
import type { Cart } from "@/features/shop/cart/types";
import { createOrderUseCase, buildCheckoutSnapshot, saveCheckoutSnapshot } from "@/features/shop/checkout/use-cases";
import { useCheckoutForm } from "@/features/shop/checkout/use-checkout-form";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export default function CheckoutPage() {
	const router = useRouter();
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state.hasHydrated);
	const setFromCart = useCartStore((state) => state.setFromCart);

	const [cart, setCart] = useState<Cart | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const { address, addressError, setAddress, validateNow } = useCheckoutForm();

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) {
			setLoading(false);
			setCart(null);
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
			} finally {
				setLoading(false);
			}
		}

		void loadCart();
	}, [hasHydrated, user, setFromCart]);

	const total = useMemo(() => {
		if (!cart) return 0;
		return cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
	}, [cart]);

	async function handleContinueToPayment(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		if (!validateNow()) return;
		if (!cart || cart.items.length === 0) {
			setError("Panier vide.");
			return;
		}

		setSubmitting(true);
		try {
			saveCheckoutSnapshot(buildCheckoutSnapshot(cart));
			const order = await createOrderUseCase({ address: address.trim() });
			router.push(`/payment/${order.id}`);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message ?? "Creation de commande echouee.");
			} else {
				setError("Creation de commande echouee.");
			}
		} finally {
			setSubmitting(false);
		}
	}

	if (!hasHydrated) {
		return (
			<section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">Chargement...</div>
			</section>
		);
	}

	if (!user) {
		return (
			<section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
					<h1 className="text-xl font-semibold text-zinc-900">Connexion requise</h1>
					<p className="mt-2 text-sm text-zinc-600">Connecte-toi pour continuer le checkout.</p>
					<Link href="/login" className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
						Login
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<CheckoutStepper current="delivery" />

			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-zinc-900">Livraison</h1>
				<Link href="/cart" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
					{"<-"} Retour panier
				</Link>
			</div>

			{error && (
				<p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
			)}

			<CartState loading={loading} error={null} cart={cart} />

			{cart && cart.items.length > 0 && (
				<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
					<form onSubmit={handleContinueToPayment} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
						<p className="text-sm text-zinc-600">Etape 1/2: valide ton adresse avant paiement.</p>
						<AppTextarea
							rows={4}
							placeholder="Rue, ville, code postal, pays"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							error={addressError}
						/>
						<AppButton type="submit" disabled={submitting}>
							{submitting ? "Creation commande..." : "Continuer vers paiement"}
						</AppButton>
					</form>

					<div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
						<h2 className="text-lg font-semibold text-zinc-900">Recapitulatif</h2>
						{cart.items.map((item) => (
							<div key={item.id} className="flex items-start justify-between gap-3 text-sm">
								<div>
									<p className="font-medium text-zinc-800">{item.product.title}</p>
									<p className="text-xs text-zinc-500">Qte: {item.quantity}</p>
								</div>
								<p className="font-medium text-zinc-800">{(Number(item.product.price) * item.quantity).toFixed(2)} MAD</p>
							</div>
						))}
						<div className="border-t border-zinc-200 pt-3 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-zinc-600">Total</span>
								<span className="text-base font-bold text-zinc-900">{total.toFixed(2)} MAD</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

