import { apiClient } from "@/lib/api-client";

export type AdminStatsResponse = {
	totalSales: number;
	totalOrders: number;
	averageBasket: number;
	lowStockProducts: number;
	topProducts: Array<{
		productId: string;
		quantitySold: number;
		product: {
			id: string;
			title: string;
			slug: string;
		} | null;
	}>;
};

export async function getAdminStats(): Promise<AdminStatsResponse> {
	const { data } = await apiClient.get<AdminStatsResponse>("/admin/stats");
	return data;
}
