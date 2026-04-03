import { getShopCategories, getShopProductById, getShopProducts } from "./api";
import type {
	ListShopCategoriesResponse,
	ListShopProductsQuery,
	ListShopProductsResponse,
	ShopProduct,
} from "./types";

export async function listShopProductsUseCase(
	query: ListShopProductsQuery,
): Promise<ListShopProductsResponse> {
	return getShopProducts(query);
}

export async function listShopCategoriesUseCase(): Promise<ListShopCategoriesResponse> {
	return getShopCategories();
}

export async function getShopProductDetailsUseCase(
	id: string,
): Promise<ShopProduct | null> {
	return getShopProductById(id);
}
