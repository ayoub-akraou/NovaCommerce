import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { compare, hash } from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';

type SafeUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

type TokenPayload = {
    sub: string;
    sid?: string;
    email: string;
    role: UserRole;
    tokenType?: 'access' | 'refresh'
}


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

        return this.issueTokensWithSession({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }

    private async issueTokensWithSession(user: SafeUser, existingSessionId?: string) {
        const sessionId = existingSessionId ?? randomUUID();
        const refreshTtlMs = 7 * 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + refreshTtlMs)

        const basePayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ ...basePayload, tokenType: 'access' }, { expiresIn: '15min' }),
            this.jwtService.signAsync(
                { ...basePayload, sid: sessionId, tokenType: 'refresh' },
                { expiresIn: '7d' },
            )
        ])

        const refreshTokenHash = await hash(refreshToken, 10);

        if (existingSessionId) {
            await this.prisma.session.update({ where: { id: sessionId }, data: { refreshTokenHash, expiresAt, revokedAt: null } })
        }
        else {
            await this.prisma.session.create({
                data: {
                    id: sessionId,
                    userId: user.id,
                    refreshTokenHash,
                    expiresAt
                }
            })
        }

        return {
            accessToken,
            refreshToken,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    async refresh(refreshToken: string) {
        const token = refreshToken.trim()
        let payload: TokenPayload;

        try {
            payload = await this.jwtService.verifyAsync<TokenPayload>(token)
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        if (payload.tokenType !== 'refresh' || !payload.sid) {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        const session = await this.prisma.session.findUnique({
            where: { id: payload.sid },
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

        if (!session || session.userId !== payload.sub || session.revokedAt || session.expiresAt <= new Date()) {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        const isMatch = await compare(token, session.refreshTokenHash)

        if (!isMatch) throw new UnauthorizedException('Invalid refresh token.')

        return this.issueTokensWithSession(session.user, session.id)
    }

    async logout(refreshToken: string) {
        const token = refreshToken.trim();

        let payload: TokenPayload;
        try {
            payload = await this.jwtService.verifyAsync<TokenPayload>(token);
        } catch {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        if (payload.tokenType !== 'refresh' || !payload.sid) {
            throw new UnauthorizedException('Invalid refresh token.');
        }

        const session = await this.prisma.session.findUnique({
            where: { id: payload.sid },
            select: { id: true, refreshTokenHash: true },
        });

        if (!session) throw new UnauthorizedException('Invalid refresh token.');

        const isMatch = await compare(token, session.refreshTokenHash);
        if (!isMatch) throw new UnauthorizedException('Invalid refresh token.');

        await this.prisma.session.update({
            where: { id: session.id },
            data: { revokedAt: new Date() },
        });

        return { success: true };
    }

}
