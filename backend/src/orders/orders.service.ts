import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderStatus, PaymentProvider, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
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

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async findMyOrders(userId: string) {
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

  async markOrderAsPaid(userId: string, orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        select: { id: true, total: true, status: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be paid.');
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

      return {
        order: updatedOrder,
        payment,
      };
    });
  }
}
