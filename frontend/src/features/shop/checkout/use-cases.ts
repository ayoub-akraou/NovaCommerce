import { addItemToCart, getMyCart } from "@/features/shop/cart/api";
import type { Cart } from "@/features/shop/cart/types";
import { createOrder, getOrder, payOrder } from "./api";
import { checkoutAddressSchema } from "./schema";
import type { CheckoutAddressValidation, CheckoutSnapshot, CreateOrderPayload, CreatedOrder } from "./types";

const CHECKOUT_SNAPSHOT_KEY = "nova_checkout_snapshot";

export function validateCheckoutAddress(address: string): CheckoutAddressValidation {
	const parsed = checkoutAddressSchema.safeParse({ address });
	if (!parsed.success) {
		return { isValid: false, error: parsed.error.issues[0]?.message ?? "Adresse invalide." };
	}
	return { isValid: true, error: null };
}

export async function createOrderUseCase(payload: CreateOrderPayload): Promise<CreatedOrder> {
	return createOrder(payload);
}

export async function getOrderUseCase(orderId: string) {
	return getOrder(orderId);
}

export async function payOrderUseCase(orderId: string) {
	return payOrder(orderId);
}

export function buildCheckoutSnapshot(cart: Cart): CheckoutSnapshot {
	return {
		createdAt: Date.now(),
		items: cart.items.map((item) => ({
			productId: item.productId,
			quantity: item.quantity,
		})),
	};
}

export function saveCheckoutSnapshot(snapshot: CheckoutSnapshot) {
	if (typeof window === "undefined") return;
	localStorage.setItem(CHECKOUT_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function readCheckoutSnapshot(): CheckoutSnapshot | null {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(CHECKOUT_SNAPSHOT_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as CheckoutSnapshot;
		if (!Array.isArray(parsed.items)) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function clearCheckoutSnapshot() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(CHECKOUT_SNAPSHOT_KEY);
}

export async function restoreCartFromSnapshotUseCase(snapshot: CheckoutSnapshot): Promise<Cart> {
	for (const item of snapshot.items) {
		await addItemToCart({ productId: item.productId, quantity: item.quantity });
	}
	const cart = await getMyCart();
	return cart;
}

