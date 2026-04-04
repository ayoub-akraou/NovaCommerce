import Link from "next/link";
import { AppButton } from "@/components/ui/app-button";
import type { Cart } from "@/features/shop/cart/types";

type CartSummaryProps = {
	cart: Cart;
	clearing: boolean;
	onClear: () => void;
};

export function CartSummary({ cart, clearing, onClear }: CartSummaryProps) {
	const total = cart.items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
	const itemsCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
			<h2 className="text-lg font-semibold text-zinc-900">Resume</h2>
			<div className="space-y-2 text-sm text-zinc-600">
				<div className="flex items-center justify-between">
					<span>Articles</span>
					<span className="font-medium text-zinc-800">{itemsCount}</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Total</span>
					<span className="text-base font-semibold text-zinc-900">{total.toFixed(2)} MAD</span>
				</div>
			</div>

			<Link href="/checkout" className="block">
				<AppButton fullWidth>Passer a la livraison</AppButton>
			</Link>
			<p className="text-xs text-zinc-500">Etape suivante: adresse puis paiement.</p>

			<AppButton type="button" variant="secondary" onClick={onClear} disabled={clearing || cart.items.length === 0} fullWidth>
				{clearing ? "Vidage..." : "Vider le panier"}
			</AppButton>
		</div>
	);
}

