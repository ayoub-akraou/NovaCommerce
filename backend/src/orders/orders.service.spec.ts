import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrderStatus } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;

  const txMock = {
    cart: {
      findFirst: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
    product: {
      update: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
  };

  const prismaMock = {
    $transaction: jest.fn(),
    order: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(async (callback: any) =>
      callback(txMock),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create order and clear cart when data is valid', async () => {
    txMock.cart.findFirst.mockResolvedValue({
      id: 'cart_1',
      items: [
        {
          productId: 'prod_1',
          quantity: 2,
          product: { id: 'prod_1', price: 10, stock: 5 },
        },
        {
          productId: 'prod_2',
          quantity: 1,
          product: { id: 'prod_2', price: 20, stock: 3 },
        },
      ],
    });

    txMock.order.create.mockResolvedValue({ id: 'order_1', items: [] });

    const result = await service.createOrder('user_1', { address: '  Casa  ' });

    expect(txMock.order.create).toHaveBeenCalledWith({
      data: {
        userId: 'user_1',
        address: 'Casa',
        total: 40,
        status: OrderStatus.PENDING,
        items: {
          create: [
            { productId: 'prod_1', quantity: 2, priceAtPurchase: 10 },
            { productId: 'prod_2', quantity: 1, priceAtPurchase: 20 },
          ],
        },
      },
      include: { items: true },
    });

    expect(txMock.product.update).toHaveBeenCalledTimes(2);
    expect(txMock.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: 'cart_1' },
    });
    expect(result).toEqual({ id: 'order_1', items: [] });
  });

  it('should throw when cart is empty', async () => {
    txMock.cart.findFirst.mockResolvedValue({ id: 'cart_1', items: [] });

    await expect(
      service.createOrder('user_1', { address: 'Casablanca' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw when one cart item exceeds stock', async () => {
    txMock.cart.findFirst.mockResolvedValue({
      id: 'cart_1',
      items: [
        {
          productId: 'prod_1',
          quantity: 6,
          product: { id: 'prod_1', price: 10, stock: 5 },
        },
      ],
    });

    await expect(
      service.createOrder('user_1', { address: 'Casablanca' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should return current user orders ordered by date desc', async () => {
    const rows = [{ id: 'order_2' }, { id: 'order_1' }];
    prismaMock.order.findMany.mockResolvedValue(rows);

    const result = await service.findMyOrders('user_1');

    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      where: { userId: 'user_1' },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(rows);
  });

  it('should return one order for the current user', async () => {
    const row = { id: 'order_1', userId: 'user_1' };
    prismaMock.order.findFirst.mockResolvedValue(row);

    const result = await service.findOneForUser('user_1', 'order_1');

    expect(prismaMock.order.findFirst).toHaveBeenCalledWith({
      where: { id: 'order_1', userId: 'user_1' },
      include: { items: true, payment: true },
    });
    expect(result).toEqual(row);
  });

  it('should return null when order is not owned by current user', async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const result = await service.findOneForUser('user_1', 'order_x');

    expect(prismaMock.order.findFirst).toHaveBeenCalledWith({
      where: { id: 'order_x', userId: 'user_1' },
      include: { items: true, payment: true },
    });
    expect(result).toBeNull();
  });

  it('should mark pending order as paid', async () => {
    txMock.order.findFirst.mockResolvedValue({
      id: 'order_1',
      total: 40,
      status: OrderStatus.PENDING,
    });
    txMock.payment.create.mockResolvedValue({ id: 'pay_1' });
    txMock.order.update.mockResolvedValue({
      id: 'order_1',
      status: OrderStatus.PAID,
      items: [],
      payment: { id: 'pay_1' },
    });

    const result = await service.markOrderAsPaid('user_1', 'order_1');

    expect(txMock.payment.create).toHaveBeenCalled();
    expect(txMock.order.update).toHaveBeenCalledWith({
      where: { id: 'order_1' },
      data: { status: OrderStatus.PAID },
      include: { items: true, payment: true },
    });
    expect(result).toEqual({
      order: {
        id: 'order_1',
        status: OrderStatus.PAID,
        items: [],
        payment: { id: 'pay_1' },
      },
      payment: { id: 'pay_1' },
    });
  });

  it('should throw when order to pay is not found', async () => {
    txMock.order.findFirst.mockResolvedValue(null);

    await expect(service.markOrderAsPaid('user_1', 'order_x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw when order status is not pending', async () => {
    txMock.order.findFirst.mockResolvedValue({
      id: 'order_1',
      total: 40,
      status: OrderStatus.PAID,
    });

    await expect(service.markOrderAsPaid('user_1', 'order_1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
