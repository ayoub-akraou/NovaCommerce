export type ShopCategory = { id: string; name: string; slug: string };

export type ShopProductsSort = "newest" | "price_asc" | "price_desc";

export type ShopProduct = {
	id: string;
	title: string;
	price: string;
	stock: number;
	images: string[];
	category: ShopCategory;
};

export type ListShopProductsQuery = {
	page?: number;
	limit?: number;
	sort?: ShopProductsSort;
};

export type ShopProductsFiltersForm = {
	search: string;
	category: string;
	minPrice: string;
	maxPrice: string;
	sort: ShopProductsSort;
};

export type ListShopProductsResponse = {
	items: ShopProduct[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

export type ListShopCategoriesResponse = ShopCategory[];
