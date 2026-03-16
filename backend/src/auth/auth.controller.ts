import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Invalid payload' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post('login')
    @Throttle({default: {ttl: 60000, limit: 10}})
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login and get access/refresh tokens' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Invalid payload' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 429, description: 'Too many login attempts' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token from refresh token' })
    @ApiResponse({ status: 200, description: 'Token refreshed' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    refresh(@Body() dto: RefreshTokenDto){
        return this.authService.refresh(dto.refreshToken)
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout current session' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    logout(@Body() dto: RefreshTokenDto) {
        return this.authService.logout(dto.refreshToken)
    }
}
