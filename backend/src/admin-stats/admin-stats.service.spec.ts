import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { AdminStatsService } from './admin-stats.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AdminStatsService', () => {
  let service: AdminStatsService;
  const prismaMock = {
    order: {
      findMany: jest.fn(),
    },
    product: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    orderItem: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminStatsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AdminStatsService>(AdminStatsService);
  });

  it('should return aggregated admin stats', async () => {
    prismaMock.order.findMany.mockResolvedValue([{ total: 100 }, { total: 50 }]);
    prismaMock.product.count.mockResolvedValue(3);
    prismaMock.orderItem.groupBy.mockResolvedValue([
      { productId: 'prod_1', _sum: { quantity: 6 } },
      { productId: 'prod_2', _sum: { quantity: 4 } },
    ]);
    prismaMock.product.findMany.mockResolvedValue([
      { id: 'prod_1', title: 'Mouse', slug: 'mouse' },
      { id: 'prod_2', title: 'Keyboard', slug: 'keyboard' },
    ]);

    const result = await service.getStats();

    expect(result).toEqual({
      totalSales: 150,
      totalOrders: 2,
      averageBasket: 75,
      lowStockProducts: 3,
      topProducts: [
        {
          productId: 'prod_1',
          quantitySold: 6,
          product: { id: 'prod_1', title: 'Mouse', slug: 'mouse' },
        },
        {
          productId: 'prod_2',
          quantitySold: 4,
          product: { id: 'prod_2', title: 'Keyboard', slug: 'keyboard' },
        },
      ],
    });
  });
});
