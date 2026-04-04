import {
	addItemToCart,
	getMyCart,
	removeCartItem,
	updateCartItemQuantity,
} from "./api";
import type {
	AddToCartInput,
	Cart,
	UpdateCartItemQuantityInput,
} from "./types";

export async function getMyCartUseCase(): Promise<Cart> {
	return getMyCart();
}

export async function addItemToCartUseCase(input: AddToCartInput): Promise<Cart> {
	return addItemToCart(input);
}

export async function updateCartItemQuantityUseCase(
	input: UpdateCartItemQuantityInput,
): Promise<Cart> {
	return updateCartItemQuantity(input);
}

export async function removeCartItemUseCase(itemId: string): Promise<Cart> {
	return removeCartItem(itemId);
}

export async function clearCartUseCase(cart: Cart): Promise<Cart> {
	let updatedCart = cart;

	for (const item of cart.items) {
		updatedCart = await removeCartItem(item.id);
	}

	return updatedCart;
}
