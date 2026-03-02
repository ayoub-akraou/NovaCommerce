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

type CreateSession = {
    id: string,
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    revokedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,

}

describe('AuthService', () => {
    let service: AuthService

    const prismaMock = {
        user: {
            findUnique: jest.fn<() => Promise<FindUnique>>(),
            create: jest.fn<() => Promise<CreateUser>>(),
        },
        session: {
            create: jest.fn<() => Promise<CreateSession>>(),
            findUnique: jest.fn<() => Promise<Object>>(),
            update: jest.fn<() => Promise<Object>>(),
        },
    }

    const jwtMock = {
        signAsync: jest.fn<() => Promise<string>>(),
        verifyAsync: jest.fn<() => Promise<Object>>(),
    }

    beforeEach(async () => {
        jest.clearAllMocks();
        prismaMock.session.create.mockReset();
        prismaMock.session.findUnique.mockReset();
        prismaMock.session.update.mockReset();
        jwtMock.verifyAsync.mockReset();


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
        jwtMock.signAsync.mockResolvedValueOnce('access123').mockResolvedValueOnce('refresh123')

        // mock session creation
        prismaMock.session.create.mockResolvedValue({
            id: 'session_1',
            userId: 'user_1',
            refreshTokenHash: 'hashed',
            expiresAt: new Date(),
            revokedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const result = await service.login(dto);

        expect(result).toEqual({
            accessToken: 'access123',
            refreshToken: 'refresh123',
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
        })

        expect(prismaMock.session.create).toHaveBeenCalled()

        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'john@example.com' },
            select: { id: true, name: true, email: true, role: true, passwordHash: true },
        })

        expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
            1,
            { sub: 'user_1', email: 'john@example.com', role: UserRole.CUSTOMER, tokenType: 'access' },
            { expiresIn: '15min' },
        );

        expect(jwtMock.signAsync).toHaveBeenNthCalledWith(
            2,
            {
            sub: 'user_1',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
                sid: expect.any(String),
                tokenType: 'refresh',
            },
            { expiresIn: '7d' },
        );


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
    it('should refresh tokens when refresh token is valid', async () => {
        const refreshToken = "refresh_Token_here"
        const refreshTokenHash = await hash(refreshToken, 10)

        jwtMock.verifyAsync.mockResolvedValue({
            sub: 'user_1',
            sid: 'session_1',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
            tokenType: 'refresh',
        })

        prismaMock.session.findUnique.mockResolvedValue({
            id: 'session_1',
            userId: 'user_1',
            refreshTokenHash,
            expiresAt: new Date(Date.now() + 60_000),
            revokedAt: null,
            user: {
                id: 'user_1',
                name: 'John Doe',
                email: 'john@example.com',
                role: UserRole.CUSTOMER,
            },
        });

        jwtMock.signAsync.mockResolvedValueOnce('new-access-token').mockResolvedValueOnce('new-refresh-token')

        prismaMock.session.update.mockResolvedValue({
            id: 'session_1',
            userId: 'user_1',
            refreshTokenHash: 'new-hash',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revokedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const result = await service.refresh(refreshToken);

        expect(jwtMock.verifyAsync).toHaveBeenCalledWith(refreshToken)

        expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
            where: { id: 'session_1' },
            select: {
                id: true,
                userId: true,
                refreshTokenHash: true,
                expiresAt: true,
                revokedAt: true,
                user: {
                    select: {
                        id: true, name: true, email: true, role: true
                    }
                }
            }
        })

        expect(result).toEqual({
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole.CUSTOMER,
        })
    })

})
