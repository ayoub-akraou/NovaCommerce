import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

type Category = {
  id: string;
  name: string;
  slug: string;
  products?: Array<{ id: string; title: string; slug: string }>;
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  const prismaMock = {
    category: {
      create: jest.fn<() => Promise<Category>>(),
      findMany: jest.fn<() => Promise<Category[]>>(),
      findUnique: jest.fn<() => Promise<Category>>(),
      update: jest.fn<() => Promise<Category>>(),
      delete: jest.fn<() => Promise<Category>>(),
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
    const rows: Category[] = [
      {
        id: 'cat_1',
        name: 'Tech',
        slug: 'tech',
        products: [{ id: 'prod_1', title: 'Mouse', slug: 'mouse' }],
      },
    ];
    prismaMock.category.findMany.mockResolvedValue(rows);

    const result = await service.findAll();

    expect(prismaMock.category.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      include: { products: true },
    });
    expect(result).toEqual(rows);
  });

  it('should return one category by id', async () => {
    const row = {
      id: 'cat_1',
      name: 'Tech',
      slug: 'tech',
      products: [{ id: 'prod_1', title: 'Mouse', slug: 'mouse' }],
    };

    prismaMock.category.findUnique.mockResolvedValue(row);

    const result = await service.findOne('cat_1');
    expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
      where: { id: 'cat_1' },
      include: { products: true },
    });

    expect(result).toEqual(row);
  });

  it('should delete one category by id', async () => {
    const row = { id: 'cat_1', name: 'Tech', slug: 'tech' };
    prismaMock.category.delete.mockResolvedValue(row);

    const result = await service.remove('cat_1');

    expect(prismaMock.category.delete).toHaveBeenCalledWith({
      where: { id: 'cat_1' },
    });

    expect(result).toEqual(row);
  });

  it('should create category with trimmed name and generated slug', async () => {
    const dto = { name: '  Home & Garden  ' };
    const created = {
      id: 'cat_2',
      name: 'Home & Garden',
      slug: 'home-and-garden',
    };
    prismaMock.category.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(prismaMock.category.create).toHaveBeenCalledWith({
      data: { name: 'Home & Garden', slug: 'home-and-garden' },
    });
    expect(result).toEqual(created);
  });

  it('should update name and slug when name is provided', async () => {
    const updated = { id: 'cat_1', name: 'New Name', slug: 'new-name' };
    prismaMock.category.update.mockResolvedValue(updated);

    const result = await service.update('cat_1', { name: '  New Name  ' });

    expect(prismaMock.category.update).toHaveBeenCalledWith({
      where: { id: 'cat_1' },
      data: { name: 'New Name', slug: 'new-name' },
    });
    expect(result).toEqual(updated);
  });
});
