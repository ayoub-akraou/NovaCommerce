import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { compare, hash } from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async register(dto: RegisterDto) {
        const normalizedEmail = dto.email.trim().toLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true }
        })

        if (existingUser) throw new ConflictException('Email already in use.')

        const passwordHash = await hash(dto.password, 10)

        return this.prisma.user.create({
            data: {
                name: dto.name.trim(),
                email: normalizedEmail,
                passwordHash,
                role: UserRole.CUSTOMER
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })
    }

    async login(dto: LoginDto) {
        const normalizedEmail = dto.email.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true, name: true, email: true, role: true, passwordHash: true },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials.');

        const isPasswordValid = await compare(dto.password, user.passwordHash);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

        const payload = { sub: user.id, email: user.email, role: user.role }
        const accessToken = await this.jwtService.signAsync(payload)

        return { accessToken, id: user.id, name: user.name, email: user.email, role: user.role };
    }

}
