import type { ShopProduct } from "@/features/shop/products/types";
import { ProductCard } from "./product-card";

type ProductsGridProps = {
	loading: boolean;
	error: string | null;
	products: ShopProduct[];
};

export function ProductsGrid({ loading, error, products }: ProductsGridProps) {
	if (error) {
		return (
			<p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
				{error}
			</p>
		);
	}

	if (loading) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
				Loading products...
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
				<h2 className="text-lg font-semibold text-zinc-900">No products found</h2>
				<p className="mt-1 text-sm text-zinc-500">Try another search or remove some filters.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
