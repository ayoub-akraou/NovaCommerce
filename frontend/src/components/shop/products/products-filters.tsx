import type { ShopCategory, ShopProductsFiltersForm, ShopProductsSort } from "@/features/shop/products/types";

type ProductsFiltersProps = {
	categories: ShopCategory[];
	filters: ShopProductsFiltersForm;
	onChange: (next: Partial<ShopProductsFiltersForm>) => void;
	onApply: () => void;
	onReset: () => void;
};

export function ProductsFilters({
	categories,
	filters,
	onChange,
	onApply,
	onReset,
}: ProductsFiltersProps) {
	const searchValue = filters.search.trim();
	const searchHint = searchValue.length > 0 && searchValue.length < 3;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onApply();
			}}
			className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-6"
		>
			<div className="lg:col-span-2">
				<input
					value={filters.search}
					onChange={(e) => onChange({ search: e.target.value })}
					placeholder="Search product..."
					className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
				/>
				{searchHint && <p className="mt-1 text-xs text-zinc-500">Tape au moins 3 caracteres pour lancer la recherche.</p>}
			</div>
			<select
				value={filters.category}
				onChange={(e) => onChange({ category: e.target.value })}
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
				type="number"
				min="0"
				step="0.01"
				value={filters.minPrice}
				onChange={(e) => onChange({ minPrice: e.target.value })}
				placeholder="Min price"
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			/>
			<input
				type="number"
				min="0"
				step="0.01"
				value={filters.maxPrice}
				onChange={(e) => onChange({ maxPrice: e.target.value })}
				placeholder="Max price"
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			/>
			<select
				value={filters.sort}
				onChange={(e) => onChange({ sort: e.target.value as ShopProductsSort })}
				className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			>
				<option value="newest">Newest</option>
				<option value="price_asc">Price low to high</option>
				<option value="price_desc">Price high to low</option>
			</select>
			<div className="lg:col-span-6 flex flex-wrap items-center justify-end gap-2">
				<button
					type="button"
					onClick={onReset}
					className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
				>
					Reset
				</button>
				<button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
					Apply filters
				</button>
			</div>
		</form>
	);
}
