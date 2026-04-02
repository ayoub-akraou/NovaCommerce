import { createAdminCategory, deleteAdminCategory, getAdminCategories, updateAdminCategory } from "./api";
import type { CreateAdminCategoryPayload, UpdateAdminCategoryPayload } from "./types";

export async function getAdminCategoriesUseCase() {
	return getAdminCategories();
}

export async function createAdminCategoryUseCase(payload: CreateAdminCategoryPayload) {
	return createAdminCategory(payload);
}

export async function updateAdminCategoryUseCase(categoryId: string, payload: UpdateAdminCategoryPayload) {
	return updateAdminCategory(categoryId, payload);
}

export async function deleteAdminCategoryUseCase(categoryId: string) {
	return deleteAdminCategory(categoryId);
}
