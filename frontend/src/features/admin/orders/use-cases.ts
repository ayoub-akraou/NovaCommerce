import { getAdminOrders, updateAdminOrderStatus } from "./api";
import type { ListAdminOrdersQuery, OrderStatus } from "./types";

export async function getAdminOrdersUseCase(query: ListAdminOrdersQuery) {
	return getAdminOrders(query);
}

export async function updateAdminOrderStatusUseCase(orderId: string, status: OrderStatus) {
	return updateAdminOrderStatus(orderId, status);
}
