import type { ShopCategory, ShopProductsFiltersForm } from "@/features/shop/products/types";

type ProductsFiltersProps = {
	categories: ShopCategory[];
	filters: ShopProductsFiltersForm;
	onChange: (next: Partial<ShopProductsFiltersForm>) => void;
	onApply: () => void;
	onReset: () => void;
};

export function ProductsFilters(_props: ProductsFiltersProps) {
	return null;
}
