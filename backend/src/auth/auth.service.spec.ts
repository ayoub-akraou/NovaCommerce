import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service.js"
import { PrismaService } from "../prisma/prisma.service.js"
import { jest } from '@jest/globals';
import { UserRole } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";

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
        signAsync: jest.fn()
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

})