import Link from "next/link";
import type { ShopCategory, ShopProductsFiltersForm } from "@/features/shop/products/types";

type ProductsFiltersProps = {
	categories: ShopCategory[];
	filters: ShopProductsFiltersForm;
	searchHint: boolean;
};

export function ProductsFilters({ categories, filters, searchHint }: ProductsFiltersProps) {
	return (
		<form action="/products" method="get" className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-6">
			<div className="lg:col-span-2">
				<input
					name="search"
					defaultValue={filters.search}
					placeholder="Search product..."
					className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
				/>
				{searchHint && <p className="mt-1 text-xs text-zinc-500">Tape au moins 3 caracteres pour lancer la recherche.</p>}
			</div>
			<select
				name="category"
				defaultValue={filters.category}
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			>
				<option value="">All categories</option>
				{categories.map((category) => (
					<option key={category.id} value={category.id}>
						{category.name}
					</option>
				))}
			</select>
			<input
				name="minPrice"
				type="number"
				min="0"
				step="0.01"
				defaultValue={filters.minPrice}
				placeholder="Min price"
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			/>
			<input
				name="maxPrice"
				type="number"
				min="0"
				step="0.01"
				defaultValue={filters.maxPrice}
				placeholder="Max price"
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			/>
			<select
				name="sort"
				defaultValue={filters.sort}
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			>
				<option value="newest">Newest</option>
				<option value="price_asc">Price low to high</option>
				<option value="price_desc">Price high to low</option>
			</select>
			<div className="lg:col-span-6 flex flex-wrap items-center justify-end gap-2">
				<Link href="/products" className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
					Reset
				</Link>
				<button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
					Apply filters
				</button>
			</div>
		</form>
	);
}
