import { addItemToCart } from "./api";
import type { AddToCartInput } from "./types";

export async function addItemToCartUseCase(input: AddToCartInput): Promise<void> {
	return addItemToCart(input);
}
