import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderStatus, PaymentProvider, PaymentStatus } from '@prisma/client';
import { ListAdminOrdersQueryDto } from './dto/list-admin-orders-query.dto.js';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  private static readonly PENDING_ORDER_TTL_MS = 30 * 60 * 1000;

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const expirationDate = new Date(
        Date.now() - OrdersService.PENDING_ORDER_TTL_MS,
      );

      await tx.order.deleteMany({
        where: {
          userId,
          status: OrderStatus.PENDING,
          createdAt: { lt: expirationDate },
        },
      });

      const cart = await tx.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, price: true, stock: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty.');
      }

      for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
          throw new BadRequestException(
            'Insufficient stock for one or more items.',
          );
        }
      }

      const total = cart.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          userId,
          address: dto.address.trim(),
          total,
          status: OrderStatus.PENDING,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  async findMyOrders(userId: string) {
    const expirationDate = new Date(Date.now() - OrdersService.PENDING_ORDER_TTL_MS);

    await this.prisma.order.deleteMany({
      where: {
        userId,
        status: OrderStatus.PENDING,
        createdAt: { lt: expirationDate },
      },
    });

    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, payment: true },
    });
  }

  async findAllForAdmin(query: ListAdminOrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: {
      status?: OrderStatus;
      userId?: string;
    } = {};

    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true, payment: true, user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markOrderAsPaid(userId: string, orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        select: {
          id: true,
          total: true,
          status: true,
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be paid.');
      }

      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true },
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(
            'Insufficient stock for one or more items.',
          );
        }
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          provider: PaymentProvider.MOCK,
          status: PaymentStatus.PAID,
          transactionId: `mock_${Date.now()}`,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID },
        include: { items: true, payment: true },
      });

      const cart = await tx.cart.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return {
        order: updatedOrder,
        payment,
      };
    });
  }

  async cancelPendingOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled.');
    }

    await this.prisma.order.delete({
      where: { id: order.id },
    });

    return { success: true };
  }

  async updateOrderStatus(orderId: string, nextStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (
      order.status === OrderStatus.PAID &&
      nextStatus === OrderStatus.PENDING
    ) {
      throw new BadRequestException('Paid order cannot return to pending.');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: { items: true, payment: true },
    });
  }
}
