import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [paidOrders, lowStockProducts, topProducts] = await Promise.all([
      this.prisma.order.findMany({
        where: { status: OrderStatus.PAID },
        select: { total: true },
      }),
      this.prisma.product.count({
        where: { stock: { lte: 5 } },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const totalOrders = paidOrders.length;
    const totalSales = paidOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );
    const averageBasket = totalOrders === 0 ? 0 : totalSales / totalOrders;

    const topProductIds = topProducts.map((item) => item.productId);
    const products = topProductIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: topProductIds } },
          select: { id: true, title: true, slug: true },
        })
      : [];

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );
    const topProductsResult = topProducts
      .map((item) => ({
        productId: item.productId,
        quantitySold: item._sum.quantity ?? 0,
        product: productsById.get(item.productId) ?? null,
      }))
      .filter((item) => item.product !== null);

    return {
      totalSales,
      totalOrders,
      averageBasket,
      lowStockProducts,
      topProducts: topProductsResult,
    };
  }
}
