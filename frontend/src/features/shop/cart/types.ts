export type AddToCartInput = {
	productId: string;
	quantity?: number;
};

export type UpdateCartItemQuantityInput = {
	itemId: string;
	quantity: number;
};

export type CartProduct = {
	id: string;
	title: string;
	slug: string;
	price: string;
	stock: number;
	images: string[];
};

export type CartItem = {
	id: string;
	cartId: string;
	productId: string;
	quantity: number;
	product: CartProduct;
};

export type Cart = {
	id: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	items: CartItem[];
};
