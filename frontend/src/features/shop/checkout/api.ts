import { apiClient } from "@/lib/api-client";
import type { PayOrderResponse, ShopOrder } from "@/features/shop/orders/types";
import type { CreateOrderPayload, CreatedOrder } from "./types";

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
	const { data } = await apiClient.post<CreatedOrder>("/orders", payload);
	return data;
}

export async function getOrder(orderId: string): Promise<ShopOrder | null> {
	const { data } = await apiClient.get<ShopOrder | null>(`/orders/${orderId}`);
	return data;
}

export async function payOrder(orderId: string): Promise<PayOrderResponse> {
	const { data } = await apiClient.patch<PayOrderResponse>(`/orders/${orderId}/pay`);
	return data;
}

