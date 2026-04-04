import { apiClient } from "@/lib/api-client";
import type { AddToCartInput, Cart, UpdateCartItemQuantityInput } from "./types";

export async function getMyCart(): Promise<Cart> {
	const { data } = await apiClient.get<Cart>("/cart");
	return data;
}

export async function addItemToCart(input: AddToCartInput): Promise<Cart> {
	const { data } = await apiClient.post<Cart>("/cart/items", {
		productId: input.productId,
		quantity: input.quantity ?? 1,
	});
	return data;
}

export async function updateCartItemQuantity(
	input: UpdateCartItemQuantityInput,
): Promise<Cart> {
	const { data } = await apiClient.patch<Cart>(`/cart/items/${input.itemId}`, {
		quantity: input.quantity,
	});
	return data;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
	const { data } = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
	return data;
}
