import { apiClient } from "@/lib/api-client";

export async function addItemToCart() {
	await apiClient.post("/cart/items", {});
}
