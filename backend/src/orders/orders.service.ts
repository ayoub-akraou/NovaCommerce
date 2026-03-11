import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderStatus } from '@prisma/client';

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

      return { ok: true }; // on complète à l’étape suivante
    });
  }
}
