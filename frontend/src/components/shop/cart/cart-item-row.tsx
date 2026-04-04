import Link from "next/link";
import { toAbsoluteImageUrl } from "@/features/shop/products/image-url";
import type { CartItem } from "@/features/shop/cart/types";

type CartItemRowProps = {
	item: CartItem;
	updating: boolean;
	onDecrease: (item: CartItem) => void;
	onIncrease: (item: CartItem) => void;
	onRemove: (item: CartItem) => void;
};

export function CartItemRow({
	item,
	updating,
	onDecrease,
	onIncrease,
	onRemove,
}: CartItemRowProps) {
	const imageUrl = toAbsoluteImageUrl(item.product.images?.[0]);
	const lineTotal = Number(item.product.price) * item.quantity;
	const canIncrease = item.quantity < item.product.stock;

	return (
		<tr className="border-t border-zinc-100">
			<td className="px-4 py-3">
				<div className="flex items-center gap-3">
					<div className="h-14 w-14 overflow-hidden rounded-lg bg-zinc-100">
						{imageUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={imageUrl} alt={item.product.title} className="h-full w-full object-cover" />
						) : (
							<div className="grid h-full w-full place-items-center text-[10px] text-zinc-400">No image</div>
						)}
					</div>
					<div>
						<Link href={`/products/${item.product.id}`} className="text-sm font-semibold text-zinc-900 hover:text-indigo-700">
							{item.product.title}
						</Link>
						<p className="text-xs text-zinc-500">Stock: {item.product.stock}</p>
					</div>
				</div>
			</td>
			<td className="px-4 py-3 text-sm text-zinc-700">{Number(item.product.price).toFixed(2)} MAD</td>
			<td className="px-4 py-3">
				<div className="inline-flex items-center overflow-hidden rounded-lg border border-zinc-300">
					<button
						type="button"
						onClick={() => onDecrease(item)}
						disabled={updating || item.quantity <= 1}
						className="h-8 w-8 text-sm text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50">
						-
					</button>
					<span className="w-10 text-center text-sm font-medium text-zinc-800">{item.quantity}</span>
					<button
						type="button"
						onClick={() => onIncrease(item)}
						disabled={updating || !canIncrease}
						className="h-8 w-8 text-sm text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50">
						+
					</button>
				</div>
			</td>
			<td className="px-4 py-3 text-sm font-semibold text-zinc-900">{lineTotal.toFixed(2)} MAD</td>
			<td className="px-4 py-3 text-right">
				<button
					type="button"
					onClick={() => onRemove(item)}
					disabled={updating}
					className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">
					Supprimer
				</button>
			</td>
		</tr>
	);
}
