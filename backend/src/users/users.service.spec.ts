import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users ordered by createdAt desc', async () => {
    const rows = [
      {
        id: 'user_1',
        name: 'John',
        email: 'john@mail.com',
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
      },
    ];
    prismaMock.user.findMany.mockResolvedValue(rows);

    const result = await service.findAll();

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(rows);
  });

  it('should update user role when user exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user_1' });
    prismaMock.user.update.mockResolvedValue({
      id: 'user_1',
      name: 'John',
      email: 'john@mail.com',
      role: UserRole.ADMIN,
      createdAt: new Date(),
    });

    const result = await service.updateRole('user_1', UserRole.ADMIN);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user_1' },
      select: { id: true },
    });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'user_1' },
      data: { role: UserRole.ADMIN },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    expect(result.role).toBe(UserRole.ADMIN);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.updateRole('missing_user', UserRole.MANAGER),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
