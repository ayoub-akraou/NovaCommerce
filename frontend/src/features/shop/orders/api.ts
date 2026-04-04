import { apiClient } from "@/lib/api-client";
import type { PayOrderResponse, ShopOrder } from "./types";

export async function getMyOrders(): Promise<ShopOrder[]> {
	const { data } = await apiClient.get<ShopOrder[]>("/orders/me");
	return data;
}

export async function getMyOrder(orderId: string): Promise<ShopOrder | null> {
	const { data } = await apiClient.get<ShopOrder | null>(`/orders/${orderId}`);
	return data;
}

export async function payMyOrder(orderId: string): Promise<PayOrderResponse> {
	const { data } = await apiClient.patch<PayOrderResponse>(`/orders/${orderId}/pay`);
	return data;
}
