"use client";

import axios from "axios";
import { useState } from "react";
import { ProductImageGallery } from "@/components/shop/product-details/product-image-gallery";
import { ProductInfoPanel } from "@/components/shop/product-details/product-info-panel";
import { addItemToCartUseCase } from "@/features/shop/cart/use-cases";
import type { ShopProduct } from "@/features/shop/products/types";
import { useCartStore } from "@/store/cart.store";

type ProductDetailsClientProps = {
	product: ShopProduct;
};

function clampQuantity(value: number, max: number) {
	if (Number.isNaN(value)) return 1;
	if (value < 1) return 1;
	if (value > max) return max;
	return value;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);
	const setFromCart = useCartStore((state) => state.setFromCart);

	async function handleAddToCart() {
		if (product.stock <= 0) return;

		setIsAdding(true);
		setFeedback(null);
		try {
			const updatedCart = await addItemToCartUseCase({
				productId: product.id,
				quantity,
			});
			setFromCart(updatedCart);
			setFeedback("Produit ajoute au panier.");
		} catch (err) {
			if (axios.isAxiosError(err) && err.response?.status === 401) {
				setFeedback("Connecte-toi pour ajouter un produit au panier.");
			} else {
				setFeedback("Impossible d'ajouter ce produit au panier.");
			}
		} finally {
			setIsAdding(false);
		}
	}

	return (
		<div className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-2">
			<ProductImageGallery
				title={product.title}
				images={product.images}
				selectedImageIndex={selectedImageIndex}
				onSelectImage={setSelectedImageIndex}
			/>

			<ProductInfoPanel
				product={product}
				quantity={quantity}
				onQuantityChange={(value) => {
					setQuantity(clampQuantity(value, Math.max(1, product.stock)));
				}}
				onAddToCart={() => void handleAddToCart()}
				isAdding={isAdding}
				feedback={feedback}
			/>
		</div>
	);
}
