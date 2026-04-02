import { createAdminProduct, deleteAdminProduct, getAdminProducts, updateAdminProduct } from "./api";
import type { CreateAdminProductPayload, ListAdminProductsQuery, UpdateAdminProductPayload } from "./types";

export async function getAdminProductsUseCase(query: ListAdminProductsQuery) {
	return getAdminProducts(query);
}

export async function createAdminProductUseCase(payload: CreateAdminProductPayload) {
	return createAdminProduct(payload);
}

export async function updateAdminProductUseCase(productId: string, payload: UpdateAdminProductPayload) {
	return updateAdminProduct(productId, payload);
}

export async function deleteAdminProductUseCase(productId: string) {
	return deleteAdminProduct(productId);
}
