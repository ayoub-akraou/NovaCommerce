export type CheckoutStep = "cart" | "delivery" | "payment" | "confirmation";

export type CheckoutFormValues = {
	address: string;
};

export type CheckoutAddressValidation = {
	isValid: boolean;
	error: string | null;
};

export type CheckoutSnapshotItem = {
	productId: string;
	quantity: number;
};

export type CheckoutSnapshot = {
	createdAt: number;
	items: CheckoutSnapshotItem[];
};

export type CreateOrderPayload = {
	address: string;
};

export type CreatedOrder = {
	id: string;
	userId: string;
	total: string;
	status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
	address: string;
	createdAt: string;
	updatedAt: string;
	items: Array<{
		orderId: string;
		productId: string;
		quantity: number;
		priceAtPurchase: string;
	}>;
};

