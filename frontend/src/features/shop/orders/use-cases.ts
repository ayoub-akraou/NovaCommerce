import { cancelMyOrder, getMyOrder, getMyOrders, payMyOrder } from "./api";
import type { PayOrderResponse, ShopOrder } from "./types";

export async function getMyOrdersUseCase(): Promise<ShopOrder[]> {
	return getMyOrders();
}

export async function getMyOrderUseCase(orderId: string): Promise<ShopOrder | null> {
	return getMyOrder(orderId);
}

export async function payMyOrderUseCase(orderId: string): Promise<PayOrderResponse> {
	return payMyOrder(orderId);
}

export async function cancelMyOrderUseCase(orderId: string): Promise<{ success: boolean }> {
	return cancelMyOrder(orderId);
}
