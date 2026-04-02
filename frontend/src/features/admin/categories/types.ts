export type AdminCategoryProduct = {
	id: string;
	title: string;
};

export type AdminCategory = {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	products: AdminCategoryProduct[];
};

export type CreateAdminCategoryPayload = {
	name: string;
};

export type UpdateAdminCategoryPayload = {
	name?: string;
};
