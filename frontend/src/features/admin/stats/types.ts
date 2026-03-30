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
