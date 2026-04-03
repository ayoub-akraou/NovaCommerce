import { apiClient } from "@/lib/api-client";

export async function getShopProducts() {
	const { data } = await apiClient.get("/products");
	return data;
}
