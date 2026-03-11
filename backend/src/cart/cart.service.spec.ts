import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CartService', () => {
  let service: CartService;

  const prismaMock = {
    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return existing cart (success)', async () => {
    const cart = { id: 'cart_1', userId: 'user_1', items: [] };
    prismaMock.cart.findFirst.mockResolvedValue(cart);

    const result = await service.getOrCreateUserCart('user_1');

    expect(prismaMock.cart.findFirst).toHaveBeenCalled();
    expect(prismaMock.cart.create).not.toHaveBeenCalled();
    expect(result).toEqual(cart);
  });

  it('should create cart when missing', async () => {
    const cart = { id: 'cart_1', userId: 'user_1', items: [] };
    prismaMock.cart.findFirst.mockResolvedValue(null);
    prismaMock.cart.create.mockResolvedValue(cart);

    const result = await service.getOrCreateUserCart('user_1');

    expect(prismaMock.cart.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { userId: 'user_1' } }),
    );
    expect(result).toEqual(cart);
  });

  it('should add item to cart (success)', async () => {
    jest
      .spyOn(service, 'getOrCreateUserCart')
      .mockResolvedValue({ id: 'cart_1' } as any)
      .mockResolvedValueOnce({ id: 'cart_1' } as any);

    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod_1',
      stock: 10,
    });
    prismaMock.cartItem.findUnique.mockResolvedValue(null);
    prismaMock.cartItem.create.mockResolvedValue({ id: 'item_1' });

    await service.addItem('user_1', { productId: 'prod_1', quantity: 2 });

    expect(prismaMock.cartItem.create).toHaveBeenCalledWith({
      data: { cartId: 'cart_1', productId: 'prod_1', quantity: 2 },
    });
  });

  it('should throw when product not found', async () => {
    jest
      .spyOn(service, 'getOrCreateUserCart')
      .mockResolvedValue({ id: 'cart_1' } as any);
    prismaMock.product.findUnique.mockResolvedValue(null);

    await expect(
      service.addItem('user_1', { productId: 'prod_x', quantity: 1 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should update item quantity (success)', async () => {
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: 'item_1',
      cart: { userId: 'user_1' },
      product: { stock: 10 },
    });
    prismaMock.cartItem.update.mockResolvedValue({ id: 'item_1', quantity: 3 });
    jest
      .spyOn(service, 'getOrCreateUserCart')
      .mockResolvedValue({ id: 'cart_1' } as any);

    await service.updateItemQuantity('user_1', 'item_1', { quantity: 3 });

    expect(prismaMock.cartItem.update).toHaveBeenCalledWith({
      where: { id: 'item_1' },
      data: { quantity: 3 },
    });
  });

  it('should throw when quantity exceeds stock', async () => {
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: 'item_1',
      cart: { userId: 'user_1' },
      product: { stock: 2 },
    });

    await expect(
      service.updateItemQuantity('user_1', 'item_1', { quantity: 3 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
