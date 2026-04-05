import type {
	ListShopCategoriesResponse,
	ListShopProductsQuery,
	ListShopProductsResponse,
	ShopProduct,
} from "./types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

async function parseResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error(`Products request failed: ${response.status}`);
	}
	return (await response.json()) as T;
}

export async function listShopProductsServer(
	query: ListShopProductsQuery,
): Promise<ListShopProductsResponse> {
	const params = new URLSearchParams();

	if (query.search) params.set("search", query.search);
	if (query.category) params.set("category", query.category);
	if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
	if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
	if (query.sort && query.sort !== "newest") params.set("sort", query.sort);
	if (query.page) params.set("page", String(query.page));
	if (query.limit) params.set("limit", String(query.limit));

	const response = await fetch(`${API_URL}/products?${params.toString()}`, {
		cache: "no-store",
	});

	return parseResponse<ListShopProductsResponse>(response);
}

export async function listShopCategoriesServer(): Promise<ListShopCategoriesResponse> {
	const response = await fetch(`${API_URL}/categories`, {
		next: { revalidate: 300 },
	});

	return parseResponse<ListShopCategoriesResponse>(response);
}

export async function getShopProductByIdServer(id: string): Promise<ShopProduct | null> {
	const response = await fetch(`${API_URL}/products/${id}`, {
		cache: "no-store",
	});

	if (response.status === 404) return null;
	return parseResponse<ShopProduct | null>(response);
}
