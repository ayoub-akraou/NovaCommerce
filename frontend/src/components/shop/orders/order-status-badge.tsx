import type { ShopOrderStatus } from "@/features/shop/orders/types";

type OrderStatusBadgeProps = {
	status: ShopOrderStatus;
};

const STATUS_STYLE: Record<ShopOrderStatus, string> = {
	PENDING: "bg-amber-100 text-amber-800 border-amber-200",
	PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
	SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-200",
	DELIVERED: "bg-violet-100 text-violet-800 border-violet-200",
	CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
	return (
		<span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
			{status}
		</span>
	);
}
