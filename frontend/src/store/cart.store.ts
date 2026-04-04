import { create } from "zustand";
import type { Cart } from "@/features/shop/cart/types";

type CartState = {
	itemsCount: number;
	setItemsCount: (count: number) => void;
	setFromCart: (cart: Cart | null) => void;
	clearCart: () => void;
};

function computeItemsCount(cart: Cart | null): number {
	if (!cart) return 0;
	return cart.items.reduce((acc, item) => acc + item.quantity, 0);
}

export const useCartStore = create<CartState>((set) => ({
	itemsCount: 0,
	setItemsCount: (count) => set({ itemsCount: Math.max(0, count) }),
	setFromCart: (cart) => set({ itemsCount: computeItemsCount(cart) }),
	clearCart: () => set({ itemsCount: 0 }),
}));
