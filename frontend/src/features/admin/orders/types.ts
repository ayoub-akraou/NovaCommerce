export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type AdminOrderItem = {
	orderId: string;
	productId: string;
	quantity: number;
	priceAtPurchase: string;
};

export type AdminOrderPayment = {
	id: string;
	orderId: string;
	amount: string;
	provider: "MOCK" | "STRIPE";
	status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
	transactionId: string | null;
	createdAt: string;
};

export type AdminOrderUser = {
	id: string;
	name: string;
	email: string;
	role: "CUSTOMER" | "ADMIN";
	createdAt: string;
	updatedAt: string;
};

export type AdminOrder = {
	id: string;
	userId: string;
	total: string;
	status: OrderStatus;
	address: string;
	createdAt: string;
	updatedAt: string;
	items: AdminOrderItem[];
	payment: AdminOrderPayment | null;
	user: AdminOrderUser;
};

export type ListAdminOrdersResponse = {
	items: AdminOrder[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

export type ListAdminOrdersQuery = {
	status?: OrderStatus;
	userId?: string;
	page?: number;
	limit?: number;
};
