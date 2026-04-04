import axios from "axios";
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

export async function cancelMyOrder(orderId: string): Promise<{ success: boolean }> {
	try {
		const { data } = await apiClient.patch<{ success: boolean }>(`/orders/${orderId}/cancel`);
		return data;
	} catch (err) {
		if (axios.isAxiosError(err) && err.response?.status === 404) {
			return { success: true };
		}
		throw err;
	}
}
