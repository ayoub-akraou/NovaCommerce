import type { Cart } from "@/features/shop/cart/types";

type CartStateProps = {
	loading: boolean;
	error: string | null;
	cart: Cart | null;
};

export function CartState({ loading, error, cart }: CartStateProps) {
	if (loading) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
				Chargement du panier...
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
				{error}
			</div>
		);
	}

	if (!cart || cart.items.length === 0) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
				<h2 className="text-lg font-semibold text-zinc-900">Ton panier est vide</h2>
				<p className="mt-1 text-sm text-zinc-500">Ajoute des produits depuis la page boutique.</p>
			</div>
		);
	}

	return null;
}
