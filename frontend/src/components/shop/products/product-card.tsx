import type { ShopProduct } from "@/features/shop/products/types";

type ProductCardProps = { product: ShopProduct };

export function ProductCard({ product }: ProductCardProps) {
	return <article>{product.title}</article>;
}
