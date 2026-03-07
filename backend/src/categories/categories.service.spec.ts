import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const prismaMock = {
    category: {
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
});
