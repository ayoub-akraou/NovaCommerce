import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
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
});
