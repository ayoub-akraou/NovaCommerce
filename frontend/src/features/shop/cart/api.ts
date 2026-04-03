import { apiClient } from "@/lib/api-client";
import type { AddToCartInput } from "./types";

export async function addItemToCart(input: AddToCartInput): Promise<void> {
	await apiClient.post("/cart/items", {
		productId: input.productId,
		quantity: input.quantity ?? 1,
	});
}
