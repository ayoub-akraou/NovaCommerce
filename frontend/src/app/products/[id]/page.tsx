"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetailsState } from "@/components/shop/product-details/product-details-state";
import { ProductImageGallery } from "@/components/shop/product-details/product-image-gallery";
import { ProductInfoPanel } from "@/components/shop/product-details/product-info-panel";
import { addItemToCartUseCase } from "@/features/shop/cart/use-cases";
import { getShopProductDetailsUseCase } from "@/features/shop/products/use-cases";
import type { ShopProduct } from "@/features/shop/products/types";
import { useCartStore } from "@/store/cart.store";

function clampQuantity(value: number, max: number) {
	if (Number.isNaN(value)) return 1;
	if (value < 1) return 1;
	if (value > max) return max;
	return value;
}

export default function ProductDetailsPage() {
	const params = useParams<{ id: string }>();
	const id = params?.id;

	const [product, setProduct] = useState<ShopProduct | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);
	const setFromCart = useCartStore((state) => state.setFromCart);

	useEffect(() => {
		if (!id) return;

		async function loadProduct() {
			setLoading(true);
			setError(null);
			setFeedback(null);
			try {
				const data = await getShopProductDetailsUseCase(id);
				if (!data) {
					setProduct(null);
					setError("Produit introuvable.");
					return;
				}
				setProduct(data);
				setSelectedImageIndex(0);
				setQuantity(1);
			} catch {
				setError("Impossible de charger ce produit.");
				setProduct(null);
			} finally {
				setLoading(false);
			}
		}

		void loadProduct();
	}, [id]);

	async function handleAddToCart() {
		if (!product || product.stock <= 0) return;

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
		<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<Link href="/products" className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-800">
				← Retour aux produits
			</Link>

			<ProductDetailsState loading={loading} error={error} />

			{!loading && !error && product && (
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
			)}
		</section>
	);
}
