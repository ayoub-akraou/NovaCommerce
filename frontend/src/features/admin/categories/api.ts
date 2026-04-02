import { apiClient } from "@/lib/api-client";
import type { AdminCategory, CreateAdminCategoryPayload, UpdateAdminCategoryPayload } from "./types";

export async function getAdminCategories(): Promise<AdminCategory[]> {
	const { data } = await apiClient.get<AdminCategory[]>("/categories");
	return data;
}

export async function createAdminCategory(payload: CreateAdminCategoryPayload): Promise<AdminCategory> {
	const { data } = await apiClient.post<AdminCategory>("/categories", payload);
	return data;
}

export async function updateAdminCategory(
	categoryId: string,
	payload: UpdateAdminCategoryPayload,
): Promise<AdminCategory> {
	const { data } = await apiClient.patch<AdminCategory>(`/categories/${categoryId}`, payload);
	return data;
}

export async function deleteAdminCategory(categoryId: string): Promise<AdminCategory> {
	const { data } = await apiClient.delete<AdminCategory>(`/categories/${categoryId}`);
	return data;
}
