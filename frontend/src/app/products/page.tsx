import { ProductsHero } from "@/components/shop/products/products-hero";
import { ProductsFilters } from "@/components/shop/products/products-filters";
import { ProductsGrid } from "@/components/shop/products/products-grid";
import { ProductsPagination } from "@/components/shop/products/products-pagination";
import {
	listShopCategoriesServer,
	listShopProductsServer,
} from "@/features/shop/products/server";
import type {
	ListShopProductsQuery,
	ShopProductsFiltersForm,
	ShopProductsSort,
} from "@/features/shop/products/types";

const DEFAULT_LIMIT = 12;

type ProductsPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readFirst(value: string | string[] | undefined): string {
	if (!value) return "";
	return Array.isArray(value) ? value[0] ?? "" : value;
}

function parseOptionalNumber(value: string): number | undefined {
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	const parsed = Number(trimmed);
	return Number.isNaN(parsed) ? undefined : parsed;
}

function parsePage(rawValue: string): number {
	const parsed = Number(rawValue);
	if (!Number.isFinite(parsed) || parsed < 1) return 1;
	return Math.floor(parsed);
}

function parseSort(rawValue: string): ShopProductsSort {
	if (rawValue === "price_asc" || rawValue === "price_desc") return rawValue;
	return "newest";
}

function toSearchQuery(value: string): string | undefined {
	const search = value.trim();
	return search.length >= 3 ? search : undefined;
}

function toPageHref(
	filters: ShopProductsFiltersForm,
	page: number,
): string {
	const params = new URLSearchParams();
	if (filters.search.trim()) params.set("search", filters.search.trim());
	if (filters.category) params.set("category", filters.category);
	if (filters.minPrice.trim()) params.set("minPrice", filters.minPrice.trim());
	if (filters.maxPrice.trim()) params.set("maxPrice", filters.maxPrice.trim());
	if (filters.sort !== "newest") params.set("sort", filters.sort);
	params.set("page", String(page));

	const query = params.toString();
	return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
	const raw = await searchParams;

	const filters: ShopProductsFiltersForm = {
		search: readFirst(raw.search),
		category: readFirst(raw.category),
		minPrice: readFirst(raw.minPrice),
		maxPrice: readFirst(raw.maxPrice),
		sort: parseSort(readFirst(raw.sort)),
	};

	const query: ListShopProductsQuery = {
		search: toSearchQuery(filters.search),
		category: filters.category || undefined,
		minPrice: parseOptionalNumber(filters.minPrice),
		maxPrice: parseOptionalNumber(filters.maxPrice),
		sort: filters.sort,
		page: parsePage(readFirst(raw.page)),
		limit: DEFAULT_LIMIT,
	};

	const [categories, productsData] = await Promise.all([
		listShopCategoriesServer(),
		listShopProductsServer(query),
	]);

	const searchHint = Boolean(
		filters.search.trim().length > 0 && filters.search.trim().length < 3,
	);

	const currentPage = productsData.meta.page;
	const totalPages = productsData.meta.totalPages;

	const previousHref = currentPage > 1 ? toPageHref(filters, currentPage - 1) : null;
	const nextHref = currentPage < totalPages ? toPageHref(filters, currentPage + 1) : null;

	return (
		<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<ProductsHero />

			<ProductsFilters
				categories={categories}
				filters={filters}
				searchHint={searchHint}
			/>

			<div className="flex items-center justify-between">
				<p className="text-sm text-zinc-600">
					{productsData.meta.total} product(s) found
				</p>
				<p className="text-sm text-zinc-600">
					Page {productsData.meta.page} / {productsData.meta.totalPages}
				</p>
			</div>

			<ProductsGrid loading={false} error={null} products={productsData.items} />

			<ProductsPagination
				page={productsData.meta.page}
				totalPages={productsData.meta.totalPages}
				previousHref={previousHref}
				nextHref={nextHref}
			/>
		</section>
	);
}
