import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
});
