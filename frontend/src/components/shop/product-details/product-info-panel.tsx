import type { ShopProduct } from "@/features/shop/products/types";

type ProductInfoPanelProps = {
	product: ShopProduct;
	quantity: number;
	onQuantityChange: (value: number) => void;
	onAddToCart: () => void;
	isAdding: boolean;
	feedback: string | null;
};

export function ProductInfoPanel({
	product,
	quantity,
	onQuantityChange,
	onAddToCart,
	isAdding,
	feedback,
}: ProductInfoPanelProps) {
	const maxQuantity = Math.max(1, product.stock);
	const canAddToCart = product.stock > 0;

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
					{product.category?.name ?? "Categorie"}
				</span>
				<h1 className="text-3xl font-bold text-zinc-900">{product.title}</h1>
				<p className="text-2xl font-semibold text-zinc-900">{Number(product.price).toFixed(2)} MAD</p>
				<p className={`text-sm font-medium ${product.stock > 0 ? "text-emerald-700" : "text-rose-700"}`}>
					{product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
				</p>
			</div>

			<p className="text-sm leading-6 text-zinc-600">{product.description ?? "Aucune description disponible pour ce produit."}</p>

			<div className="flex flex-wrap items-center gap-3">
				<label htmlFor="product-quantity" className="text-sm font-medium text-zinc-700">
					Quantite
				</label>
				<input
					id="product-quantity"
					type="number"
					min={1}
					max={maxQuantity}
					value={quantity}
					onChange={(e) => onQuantityChange(Number(e.target.value))}
					disabled={!canAddToCart}
					className="w-24 rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
				/>
				<button
					type="button"
					onClick={onAddToCart}
					disabled={!canAddToCart || isAdding}
					className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
					{isAdding ? "Ajout..." : canAddToCart ? "Ajouter au panier" : "Indisponible"}
				</button>
			</div>

			{feedback && <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{feedback}</p>}
		</div>
	);
}
