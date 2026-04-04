export type ShopOrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type ShopOrderItem = {
	orderId: string;
	productId: string;
	quantity: number;
	priceAtPurchase: string;
};

export type ShopPayment = {
	id: string;
	orderId: string;
	amount: string;
	provider: "MOCK";
	status: "PENDING" | "PAID" | "FAILED";
	transactionId: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ShopOrder = {
	id: string;
	userId: string;
	total: string;
	status: ShopOrderStatus;
	address: string;
	createdAt: string;
	updatedAt: string;
	items: ShopOrderItem[];
	payment: ShopPayment | null;
};

export type PayOrderResponse = {
	order: ShopOrder;
	payment: ShopPayment;
};
