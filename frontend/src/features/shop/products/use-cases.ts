import { getShopCategories, getShopProducts } from "./api";
import type { ListShopProductsQuery } from "./types";

export async function listShopProductsUseCase(query: ListShopProductsQuery) {
	return getShopProducts(query);
}

export async function listShopCategoriesUseCase() {
	return getShopCategories();
}
