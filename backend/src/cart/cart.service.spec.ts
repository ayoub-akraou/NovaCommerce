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
});
