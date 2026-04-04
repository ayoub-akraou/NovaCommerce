type ProductDetailsStateProps = {
	loading: boolean;
	error: string | null;
};

export function ProductDetailsState({ loading, error }: ProductDetailsStateProps) {
	if (loading) {
		return (
			<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
				Chargement du produit...
			</div>
		);
	}

	if (!error) return null;

	return (
		<div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
			{error}
		</div>
	);
}
