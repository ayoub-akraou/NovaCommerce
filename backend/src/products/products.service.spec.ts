import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';
import { jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProductsService', () => {
  let service: ProductsService;

  const prismaMock = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create product (success)', async () => {
    const dto = {
      categoryId: 'cat_1',
      title: '  Gaming Mouse  ',
      description: '  RGB mouse  ',
      price: 49.99,
      stock: 10,
      images: ['https://img.test/mouse.png'],
    };

    const created = {
      id: 'prod_1',
      categoryId: 'cat_1',
      title: 'Gaming Mouse',
      slug: 'gaming-mouse',
      description: 'RGB mouse',
      price: 49.99,
      stock: 10,
      images: ['https://img.test/mouse.png'],
    };

    prismaMock.product.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        categoryId: 'cat_1',
        title: 'Gaming Mouse',
        slug: 'gaming-mouse',
        description: 'RGB mouse',
        price: 49.99,
        stock: 10,
        images: ['https://img.test/mouse.png'],
      },
    });

    expect(result).toEqual(created);
  });

  it('should throw when create fails (error)', async () => {
    const dto = {
      categoryId: 'cat_1',
      title: 'Gaming Mouse',
      price: 49.99,
    };

    const error = new Error('Create failed');
    prismaMock.product.create.mockRejectedValue(error);

    await expect(service.create(dto as any)).rejects.toBe(error);
  });

  it('should return products ordered by createdAt desc (success)', async () => {
    const rows = [
      { id: 'prod_2', title: 'Keyboard', slug: 'keyboard' },
      { id: 'prod_1', title: 'Mouse', slug: 'mouse' },
    ];
    prismaMock.product.findMany.mockResolvedValue(rows);

    const result = await service.findAll();

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(rows);
  });

  it('should throw when findAll fails (error)', async () => {
    const error = new Error('FindAll failed');
    prismaMock.product.findMany.mockRejectedValue(error);

    await expect(service.findAll()).rejects.toBe(error);
  });

  it('should return one product by id (success)', async () => {
    const row = { id: 'prod_1', title: 'Mouse', slug: 'mouse' };
    prismaMock.product.findUnique.mockResolvedValue(row);

    const result = await service.findOne('prod_1');

    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { id: 'prod_1' },
    });
    expect(result).toEqual(row);
  });

  it('should throw when findOne fails (error)', async () => {
    const error = new Error('FindOne failed');
    prismaMock.product.findUnique.mockRejectedValue(error);

    await expect(service.findOne('prod_1')).rejects.toBe(error);
  });

  it('should update product and regenerate slug (success)', async () => {
    const dto = {
      title: '  Mechanical Keyboard  ',
      description: '  RGB switches  ',
      price: 120,
      stock: 5,
      images: ['https://img.test/kb.png'],
    };

    const updated = {
      id: 'prod_1',
      title: 'Mechanical Keyboard',
      slug: 'mechanical-keyboard',
      description: 'RGB switches',
      price: 120,
      stock: 5,
      images: ['https://img.test/kb.png'],
    };
    prismaMock.product.update.mockResolvedValue(updated);

    const result = await service.update('prod_1', dto);

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 'prod_1' },
      data: {
        title: 'Mechanical Keyboard',
        slug: 'mechanical-keyboard',
        description: 'RGB switches',
        price: 120,
        stock: 5,
        images: ['https://img.test/kb.png'],
      },
    });
    expect(result).toEqual(updated);
  });

  it('should throw when update fails (error)', async () => {
    const error = new Error('Update failed');
    prismaMock.product.update.mockRejectedValue(error);

    await expect(service.update('prod_1', { title: 'X' })).rejects.toBe(error);
  });

  it('should remove product by id (success)', async () => {
    const deleted = { id: 'prod_1', title: 'Mouse', slug: 'mouse' };
    prismaMock.product.delete.mockResolvedValue(deleted);

    const result = await service.remove('prod_1');

    expect(prismaMock.product.delete).toHaveBeenCalledWith({
      where: { id: 'prod_1' },
    });
    expect(result).toEqual(deleted);
  });

  it('should throw when remove fails (error)', async () => {
    const error = new Error('Delete failed');
    prismaMock.product.delete.mockRejectedValue(error);

    await expect(service.remove('prod_1')).rejects.toBe(error);
  });
});
