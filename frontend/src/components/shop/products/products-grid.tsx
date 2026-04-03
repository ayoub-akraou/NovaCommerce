import type { ShopProduct } from "@/features/shop/products/types";

type ProductsGridProps = {
	loading: boolean;
	error: string | null;
	products: ShopProduct[];
};

export function ProductsGrid(_props: ProductsGridProps) {
	return null;
}
