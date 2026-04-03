import { apiClient } from "@/lib/api-client";
import type {
	ListShopCategoriesResponse,
	ListShopProductsQuery,
	ListShopProductsResponse,
	ShopProduct,
} from "./types";

export async function getShopProducts(
	query: ListShopProductsQuery,
): Promise<ListShopProductsResponse> {
	const params = new URLSearchParams();

	if (query.search) params.set("search", query.search);
	if (query.category) params.set("category", query.category);
	if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
	if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
	if (query.sort) params.set("sort", query.sort);
	if (query.page) params.set("page", String(query.page));
	if (query.limit) params.set("limit", String(query.limit));

	const { data } = await apiClient.get<ListShopProductsResponse>("/products", { params });
	return data;
}

export async function getShopProductById(
	id: string,
): Promise<ShopProduct | null> {
	const { data } = await apiClient.get<ShopProduct | null>(`/products/${id}`);
	return data;
}

export async function getShopCategories(): Promise<ListShopCategoriesResponse> {
	const { data } = await apiClient.get<ListShopCategoriesResponse>("/categories");
	return data;
}
