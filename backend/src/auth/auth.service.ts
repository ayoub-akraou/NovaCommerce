import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { hash } from 'bcryptjs';
import { UserRole } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register(dto: RegisterDto) {
        const normalizedEmail = dto.email.trim().toLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: {email: normalizedEmail},
            select: {id: true}
        })

        if(existingUser) throw new ConflictException('Email already in use.')

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
}
