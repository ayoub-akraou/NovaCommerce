import Link from "next/link";
import { CheckoutStepper } from "@/components/shop/checkout/checkout-stepper";

type CheckoutSuccessPageProps = {
	searchParams: Promise<{ orderId?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
	const params = await searchParams;
	const orderId = params.orderId;

	return (
		<section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<CheckoutStepper current="confirmation" orderId={orderId} />

			<div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
				<div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-2xl text-white">
					?
				</div>
				<h1 className="text-2xl font-bold text-emerald-900">Commande confirmee</h1>
				<p className="mt-2 text-sm text-emerald-800">Ton paiement est confirme avec succes.</p>
				{orderId && <p className="mt-3 text-xs font-medium text-emerald-900">Order ID: {orderId}</p>}
				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<Link href="/orders" className="rounded-xl border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">
						Historique
					</Link>
					<Link href="/products" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
						Continuer shopping
					</Link>
				</div>
			</div>
		</section>
	);
}

