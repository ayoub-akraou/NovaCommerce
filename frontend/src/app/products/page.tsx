"use client";

import { useEffect, useState } from "react";
import { ProductsHero } from "@/components/shop/products/products-hero";
import { ProductsFilters } from "@/components/shop/products/products-filters";
import { ProductsGrid } from "@/components/shop/products/products-grid";
import { ProductsPagination } from "@/components/shop/products/products-pagination";
import { listShopCategoriesUseCase, listShopProductsUseCase } from "@/features/shop/products/use-cases";
import type { ListShopProductsQuery, ShopCategory, ShopProduct, ShopProductsFiltersForm } from "@/features/shop/products/types";

const DEFAULT_LIMIT = 12;

const DEFAULT_FILTERS: ShopProductsFiltersForm = {
	search: "",
	category: "",
	minPrice: "",
	maxPrice: "",
	sort: "newest",
};

const DEFAULT_META = {
	page: 1,
	limit: DEFAULT_LIMIT,
	total: 0,
	totalPages: 1,
};

function parseOptionalNumber(value: string): number | undefined {
	if (!value.trim()) return undefined;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
}

function toSearchQuery(value: string): string | undefined {
	const search = value.trim();
	return search.length >= 3 ? search : undefined;
}

export default function ProductsPage() {
	const [products, setProducts] = useState<ShopProduct[]>([]);
	const [categories, setCategories] = useState<ShopCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<ShopProductsFiltersForm>(DEFAULT_FILTERS);
	const [query, setQuery] = useState<ListShopProductsQuery>({
		page: 1,
		limit: DEFAULT_LIMIT,
		sort: "newest",
	});
	const [meta, setMeta] = useState(DEFAULT_META);

	useEffect(() => {
		async function loadCategories() {
			try {
				setCategories(await listShopCategoriesUseCase());
			} catch {
				setCategories([]);
			}
		}

		void loadCategories();
	}, []);

	useEffect(() => {
		const handler = setTimeout(() => {
			setQuery((current) => ({
				...current,
				page: 1,
				search: toSearchQuery(filters.search),
			}));
		}, 350);

		return () => clearTimeout(handler);
	}, [filters.search]);

	useEffect(() => {
		async function loadProducts() {
			setLoading(true);
			setError(null);
			try {
				const data = await listShopProductsUseCase(query);
				setProducts(data.items);
				setMeta(data.meta);
			} catch {
				setError("Impossible de charger les produits.");
				setProducts([]);
				setMeta(DEFAULT_META);
			} finally {
				setLoading(false);
			}
		}

		void loadProducts();
	}, [query]);

	function updateFilters(next: Partial<ShopProductsFiltersForm>) {
		setFilters((current) => ({
			...current,
			...next,
		}));
	}

	function applyFilters() {
		setQuery((current) => ({
			...current,
			page: 1,
			sort: filters.sort,
			category: filters.category || undefined,
			minPrice: parseOptionalNumber(filters.minPrice),
			maxPrice: parseOptionalNumber(filters.maxPrice),
		}));
	}

	function resetFilters() {
		setFilters(DEFAULT_FILTERS);
		setQuery({
			page: 1,
			limit: DEFAULT_LIMIT,
			sort: "newest",
		});
	}

	const hasFilters = Boolean(
		query.search || query.category || query.minPrice !== undefined || query.maxPrice !== undefined || query.sort !== "newest",
	);

	return (
		<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<ProductsHero />

			<ProductsFilters
				categories={categories}
				filters={filters}
				onChange={updateFilters}
				onApply={applyFilters}
				onReset={resetFilters}
			/>

			<div className="flex items-center justify-between">
				<p className="text-sm text-zinc-600">
					{meta.total} product(s) found {hasFilters ? "with filters" : ""}
				</p>
				<p className="text-sm text-zinc-600">
					Page {meta.page} / {meta.totalPages}
				</p>
			</div>

			<ProductsGrid loading={loading} error={error} products={products} />

			<ProductsPagination
				page={meta.page}
				totalPages={meta.totalPages}
				onPrevious={() =>
					setQuery((current) => ({
						...current,
						page: Math.max(1, (current.page ?? 1) - 1),
					}))
				}
				onNext={() =>
					setQuery((current) => ({
						...current,
						page: meta.totalPages > (current.page ?? 1) ? (current.page ?? 1) + 1 : current.page ?? 1,
					}))
				}
			/>
		</section>
	);
}
