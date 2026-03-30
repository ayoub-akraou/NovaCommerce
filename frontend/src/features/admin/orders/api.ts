import { apiClient } from "@/lib/api-client";
import { AdminOrder, ListAdminOrdersQuery, ListAdminOrdersResponse, OrderStatus } from "./types";

export async function getAdminOrders(query: ListAdminOrdersQuery): Promise<ListAdminOrdersResponse> {
	const params = new URLSearchParams();

	if (query.status) params.set("status", query.status);
	if (query.userId) params.set("userId", query.userId);
	if (query.page) params.set("page", String(query.page));
	if (query.limit) params.set("limit", String(query.limit));

	const { data } = await apiClient.get<ListAdminOrdersResponse>("/orders/admin", { params });
	return data;
}

export async function updateAdminOrderStatus(orderId: string, status: OrderStatus): Promise<AdminOrder> {
	const { data } = await apiClient.patch<AdminOrder>(`/orders/admin/${orderId}/status`, { status });
	return data;
}
