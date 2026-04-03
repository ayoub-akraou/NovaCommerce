import type { ShopProduct } from "@/features/shop/products/types";

type ProductInfoPanelProps = {
	product: ShopProduct;
};

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
	return <div>{product.title}</div>;
}
