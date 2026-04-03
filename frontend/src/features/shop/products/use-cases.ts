import { getShopCategories, getShopProducts } from "./api";
import type {
	ListShopCategoriesResponse,
	ListShopProductsQuery,
	ListShopProductsResponse,
} from "./types";

export async function listShopProductsUseCase(
	query: ListShopProductsQuery,
): Promise<ListShopProductsResponse> {
	return getShopProducts(query);
}

export async function listShopCategoriesUseCase(): Promise<ListShopCategoriesResponse> {
	return getShopCategories();
}
