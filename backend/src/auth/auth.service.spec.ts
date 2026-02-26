import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service.js"
import { PrismaService } from "../prisma/prisma.service.js"
import { jest } from '@jest/globals';
import { UserRole } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { hash } from "bcryptjs";
import { UnauthorizedException } from "@nestjs/common";

type LoginUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    passwordHash: string;
}

type FindUnique = { id: string } | LoginUser | null;

type CreateUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

describe('AuthService', () => {
    let service: AuthService

    const prismaMock = {
        user: {
            findUnique: jest.fn<() => Promise<FindUnique>>(),
            create: jest.fn<() => Promise<CreateUser>>()
        }
    }

    const jwtMock = {
        signAsync: jest.fn<() => Promise<string>>()
    }

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                },
                {
                    provide: JwtService,
                    useValue: jwtMock
                }
            ],
        }).compile()

        service = module.get<AuthService>(AuthService);
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    it('should register a new user', async () => {
        const dto = {
            name: '  John Doe  ',
            email: '  JOHN@EXAMPLE.COM  ',
            password: 'password123',
        };

        prismaMock.user.findUnique.mockResolvedValue(null)

        prismaMock.user.create.mockResolvedValue(
            {
                id: 'user_1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'CUSTOMER',
                createdAt: new Date('2026-01-01T00:00:00.000Z'),
            }
        )

        const result = await service.register(dto)

        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'john@example.com' },
            select: { id: true }
        })

        expect(prismaMock.user.create).toHaveBeenCalled()

        expect(result).toMatchObject({
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'CUSTOMER',
        })
    })

    it('should login and return access token', async () => {
        const dto = { email: 'john@example.com', password: "Password123" };
        const passwordHash = await hash('Password123', 12)

        // mock findUnique
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
            passwordHash,
        })

        // mock Jwt signAsync
        jwtMock.signAsync.mockResolvedValue('token123')

        const result = await service.login(dto);
        expect(result).toEqual({
            accessToken: "token123",
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole.CUSTOMER
        })


        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'john@example.com' },
            select: { id: true, name: true, email: true, role: true, passwordHash: true },
        })

        expect(jwtMock.signAsync).toHaveBeenCalledWith({
            sub: 'user_1',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
        })
    })

    it('should throw UnauthorizedException when user is not found', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(service.login({ email: 'fake@email.com', password: 'password' })).rejects.toBeInstanceOf(UnauthorizedException)
        expect(jwtMock.signAsync).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException when password is invalid', async () => {
        const passwordHash = await hash('CorrectPassword123', 10);

        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
            passwordHash,
        });

        await expect(
            service.login({ email: 'john@example.com', password: 'WrongPassword123' }),
        ).rejects.toBeInstanceOf(UnauthorizedException);

        expect(jwtMock.signAsync).not.toHaveBeenCalled();
    });
})
