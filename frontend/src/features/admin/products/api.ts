import { apiClient } from "@/lib/api-client";
import type {
	CreateAdminProductPayload,
	AdminProduct,
	ListAdminProductsQuery,
	ListAdminProductsResponse,
	UpdateAdminProductPayload,
} from "./types";

export async function getAdminProducts(query: ListAdminProductsQuery): Promise<ListAdminProductsResponse> {
	const params = new URLSearchParams();
	if (query.page) params.set("page", String(query.page));
	if (query.limit) params.set("limit", String(query.limit));
	if (query.category) params.set("category", query.category);
	if (query.search) params.set("search", query.search);

	const { data } = await apiClient.get<ListAdminProductsResponse>("/products", { params });
	return data;
}

export async function createAdminProduct(payload: CreateAdminProductPayload): Promise<AdminProduct> {
	const { data } = await apiClient.post<AdminProduct>("/products", payload);
	return data;
}

export async function updateAdminProduct(
	productId: string,
	payload: UpdateAdminProductPayload,
): Promise<AdminProduct> {
	const { data } = await apiClient.patch<AdminProduct>(`/products/${productId}`, payload);
	return data;
}

export async function deleteAdminProduct(productId: string): Promise<AdminProduct> {
	const { data } = await apiClient.delete<AdminProduct>(`/products/${productId}`);
	return data;
}
