import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

type Category = { id: string; name: string; slug: string };

describe('CategoriesService', () => {
  let service: CategoriesService;

  const prismaMock = {
    category: {
      create: jest.fn(),
      findMany: jest.fn<() => Promise<Category[]>>(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories ordered by createdAt desc', async () => {
    const rows: Category[] = [{ id: 'cat_1', name: 'Tech', slug: 'tech' }];
    prismaMock.category.findMany.mockResolvedValue(rows);

    const result = await service.findAll();

    expect(prismaMock.category.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(rows);
  });
});
