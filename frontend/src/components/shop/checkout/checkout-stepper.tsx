import Link from "next/link";
import type { CheckoutStep } from "@/features/shop/checkout/types";

type CheckoutStepperProps = {
	current: CheckoutStep;
	orderId?: string;
};

const STEPS: Array<{ key: CheckoutStep; label: string }> = [
	{ key: "cart", label: "Panier" },
	{ key: "delivery", label: "Livraison" },
	{ key: "payment", label: "Paiement" },
	{ key: "confirmation", label: "Confirmation" },
];

function getStepHref(step: CheckoutStep, orderId?: string): string | null {
	if (step === "cart") return "/cart";
	if (step === "delivery") return "/checkout";
	if (step === "payment") return orderId ? `/payment/${orderId}` : null;
	if (step === "confirmation") return "/orders";
	return null;
}

export function CheckoutStepper({ current, orderId }: CheckoutStepperProps) {
	const currentIndex = STEPS.findIndex((step) => step.key === current);

	return (
		<div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
			<ol className="grid gap-3 sm:grid-cols-4">
				{STEPS.map((step, index) => {
					const isDone = index < currentIndex;
					const isActive = index === currentIndex;
					const href = getStepHref(step.key, orderId);
					const content = (
						<>
							<span
								className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
									isActive
										? "bg-indigo-600 text-white"
										: isDone
											? "bg-emerald-600 text-white"
											: "bg-zinc-200 text-zinc-600"
								}`}
							>
								{index + 1}
							</span>
							<span className={`text-xs ${isActive ? "font-semibold text-zinc-900" : "text-zinc-500"}`}>
								{step.label}
							</span>
						</>
					);

					return (
						<li key={step.key} className="flex items-center gap-2">
							{href ? (
								<Link href={href} className="flex items-center gap-2">
									{content}
								</Link>
							) : (
								<div className="flex items-center gap-2">{content}</div>
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
}

