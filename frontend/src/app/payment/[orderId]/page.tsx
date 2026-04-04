"use client";

import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckoutStepper } from "@/components/shop/checkout/checkout-stepper";
import { AppButton } from "@/components/ui/app-button";
import { getMyCartUseCase } from "@/features/shop/cart/use-cases";
import {
	cancelMyOrderUseCase,
	getMyOrderUseCase,
	payMyOrderUseCase,
} from "@/features/shop/orders/use-cases";
import type { ShopOrder } from "@/features/shop/orders/types";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export default function PaymentPage() {
	const params = useParams<{ orderId: string }>();
	const router = useRouter();
	const orderId = params?.orderId;
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state.hasHydrated);
	const clearCart = useCartStore((state) => state.clearCart);
	const setFromCart = useCartStore((state) => state.setFromCart);

	const [order, setOrder] = useState<ShopOrder | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);
	const [paying, setPaying] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const hasFinalizedRef = useRef(false);
	const latestOrderRef = useRef<ShopOrder | null>(null);
	const autoCancelArmedRef = useRef(false);

	latestOrderRef.current = order;

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user || !orderId) {
			setLoading(false);
			setOrder(null);
			return;
		}

		async function loadOrder() {
			setLoading(true);
			setError(null);
			try {
				const data = await getMyOrderUseCase(orderId);
				if (!data) {
					setOrder(null);
					setError("Commande introuvable.");
					return;
				}
				setOrder(data);
			} catch {
				setOrder(null);
				setError("Impossible de charger le paiement.");
			} finally {
				setLoading(false);
			}
		}

		void loadOrder();
	}, [hasHydrated, user, orderId]);

	async function handlePay() {
		if (!order) return;
		setError(null);
		setInfo(null);

		if (!termsAccepted) {
			setError("Confirme les conditions avant de payer.");
			return;
		}

		setPaying(true);
		try {
			const result = await payMyOrderUseCase(order.id);
			hasFinalizedRef.current = true;
			setOrder(result.order);
			clearCart();
			router.replace(`/checkout/success?orderId=${result.order.id}`);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message ?? "Paiement echoue.");
			} else {
				setError("Paiement echoue.");
			}
		} finally {
			setPaying(false);
		}
	}

	async function handleCancelOrder() {
		if (!order) return;
		setError(null);
		setInfo(null);
		setCancelling(true);
		try {
			await cancelMyOrderUseCase(order.id);
			hasFinalizedRef.current = true;
			const cart = await getMyCartUseCase();
			setFromCart(cart);
			setInfo("Commande annulee. Panier conserve.");
			router.push("/cart");
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message ?? "Impossible d'annuler la commande.");
			} else {
				setError("Impossible d'annuler la commande.");
			}
		} finally {
			setCancelling(false);
		}
	}

	useEffect(() => {
		const armTimer = setTimeout(() => {
			autoCancelArmedRef.current = true;
		}, 0);

		return () => {
			clearTimeout(armTimer);
			const latestOrder = latestOrderRef.current;
			if (!autoCancelArmedRef.current) return;
			if (!latestOrder) return;
			if (hasFinalizedRef.current) return;
			if (latestOrder.status !== "PENDING") return;
			void cancelMyOrderUseCase(latestOrder.id);
		};
	}, []);

	if (!hasHydrated || loading) {
		return (
			<section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">Chargement paiement...</div>
			</section>
		);
	}

	if (!user) {
		return (
			<section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
					<h1 className="text-xl font-semibold text-zinc-900">Connexion requise</h1>
					<Link href="/login" className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
						Login
					</Link>
				</div>
			</section>
		);
	}

	if (!order) {
		return (
			<section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
					{error ?? "Commande introuvable."}
				</div>
			</section>
		);
	}

	const canPay = order.status === "PENDING";

	return (
		<section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<CheckoutStepper current={canPay ? "payment" : "confirmation"} orderId={order.id} />

			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-zinc-900">Paiement</h1>
				<Link href="/orders" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
					Historique
				</Link>
			</div>

			{error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
			{info && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>}

			<div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="space-y-2 text-sm text-zinc-700">
					<p><span className="font-semibold text-zinc-900">Order ID:</span> {order.id}</p>
					<p><span className="font-semibold text-zinc-900">Adresse:</span> {order.address}</p>
					<p><span className="font-semibold text-zinc-900">Statut:</span> {order.status}</p>
					<p><span className="font-semibold text-zinc-900">Articles:</span> {order.items.length}</p>
				</div>

				<div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
					<p className="text-sm text-zinc-600">Montant a payer</p>
					<p className="text-2xl font-bold text-zinc-900">{Number(order.total).toFixed(2)} MAD</p>

					<label className="flex items-start gap-2 text-xs text-zinc-600">
						<input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5" />
						J&apos;accepte les conditions de paiement.
					</label>

					<div className="grid gap-2">
						<AppButton onClick={() => void handlePay()} disabled={!canPay || paying} fullWidth>
							{paying ? "Paiement..." : canPay ? "Payer maintenant" : "Deja payee"}
						</AppButton>
						<AppButton
							variant="secondary"
							onClick={() => void handleCancelOrder()}
							disabled={cancelling || paying || !canPay}
							fullWidth
						>
							{cancelling ? "Annulation..." : "Annuler la commande"}
						</AppButton>
					</div>
				</div>
			</div>
		</section>
	);
}
