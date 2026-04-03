import { getShopProducts } from "./api";

export async function listShopProductsUseCase(query: unknown) {
	return getShopProducts(query as never);
}
