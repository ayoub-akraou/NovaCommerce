export type AdminProductCategory = {
	id: string;
	name: string;
	slug: string;
};

export type AdminProduct = {
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
	category: AdminProductCategory;
};

export type ListAdminProductsResponse = {
	items: AdminProduct[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

export type ListAdminProductsQuery = {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
};

export type CreateAdminProductPayload = {
	categoryId: string;
	title: string;
	description?: string;
	price: number;
	stock?: number;
	images?: string[];
};

export type UpdateAdminProductPayload = {
	categoryId?: string;
	title?: string;
	description?: string;
	price?: number;
	stock?: number;
	images?: string[];
};
