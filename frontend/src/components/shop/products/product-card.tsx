"use client";

import Link from "next/link";
import { useState } from "react";
import { toAbsoluteImageUrl } from "@/features/shop/products/image-url";
import type { ShopProduct } from "@/features/shop/products/types";

type ProductCardProps = {
	product: ShopProduct;
};

export function ProductCard({ product }: ProductCardProps) {
	const [imageFailed, setImageFailed] = useState(false);
	const imageUrl = toAbsoluteImageUrl(product.images?.[0]);
	const canShowImage = Boolean(imageUrl) && !imageFailed;
	const isOutOfStock = product.stock <= 0;

	return (
		<article
			className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
				isOutOfStock ? "grayscale" : ""
			}`}
		>
			<div className="relative h-44 bg-gradient-to-br from-zinc-100 via-zinc-50 to-indigo-50">
				{canShowImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={imageUrl ?? undefined}
						alt={product.title}
						onError={() => setImageFailed(true)}
						loading="lazy"
						decoding="async"
						className="h-full w-full object-contain"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-xs font-medium text-zinc-400">No image</div>
				)}
				<div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
					{isOutOfStock ? "Rupture" : `Stock ${product.stock}`}
				</div>
			</div>

			<div className="space-y-2 p-4">
				<div className="flex items-center justify-between gap-2">
					<span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
						{product.category?.name ?? "Category"}
					</span>
					<span className="text-sm font-semibold text-zinc-900">{Number(product.price).toFixed(2)} MAD</span>
				</div>
				<h3 className="line-clamp-1 text-sm font-semibold text-zinc-900">{product.title}</h3>
				<p className="line-clamp-2 text-xs text-zinc-500">{product.description ?? "No description provided."}</p>
				<Link
					href={`/products/${product.id}`}
					className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-center text-xs font-semibold text-zinc-800 transition hover:border-indigo-600 hover:text-indigo-700">
					View details
				</Link>
			</div>
		</article>
	);
}
