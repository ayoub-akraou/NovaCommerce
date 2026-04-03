export type ShopCategory = {
	id: string;
	name: string;
	slug: string;
};

export type ShopProductsSort = "newest" | "price_asc" | "price_desc";

export type ShopProduct = {
	id: string;
	categoryId: string;
	title: string;
	slug: string;
	description: string | null;
	price: string;
	stock: number;
	images: string[];
	createdAt: string;
	updatedAt: string;
	category: ShopCategory;
};

export type ListShopProductsQuery = {
	search?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	sort?: ShopProductsSort;
	page?: number;
	limit?: number;
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

export type ListShopCategoriesResponse = Array<{
	id: string;
	name: string;
	slug: string;
}>;
