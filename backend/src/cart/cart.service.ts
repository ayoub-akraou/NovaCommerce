import { PrismaService } from '../prisma/prisma.service.js';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateUserCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                stock: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  price: true,
                  stock: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateUserCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, stock: true },
    });

    if (!product) throw new NotFoundException('Product not found.');
    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock.');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: dto.productId },
      },
      select: { id: true, quantity: true },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException('Insufficient stock.');
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getOrCreateUserCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        cartId: true,
        productId: true,
        cart: { select: { userId: true } },
        product: { select: { stock: true } },
      },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found.');
    }

    if (dto.quantity > item.product.stock) {
      throw new BadRequestException('Insufficient stock.');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getOrCreateUserCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        cart: { select: { userId: true } },
      },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found.');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getOrCreateUserCart(userId);
  }

}
