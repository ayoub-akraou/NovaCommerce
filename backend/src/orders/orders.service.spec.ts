import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrderStatus } from '@prisma/client';

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
});
