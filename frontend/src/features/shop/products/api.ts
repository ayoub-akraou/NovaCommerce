import { apiClient } from "@/lib/api-client";
import type { ListShopProductsQuery, ListShopProductsResponse } from "./types";

export async function getShopProducts(query: ListShopProductsQuery): Promise<ListShopProductsResponse> {
	const { data } = await apiClient.get<ListShopProductsResponse>("/products", { params: query });
	return data;
}

export async function getShopCategories(): Promise<Array<{ id: string; name: string; slug: string }>> {
	const { data } = await apiClient.get<Array<{ id: string; name: string; slug: string }>>("/categories");
	return data;
}
