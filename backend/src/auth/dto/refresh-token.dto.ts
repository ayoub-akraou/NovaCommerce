import { IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
    @ApiProperty({ example: 'rt_very_long_refresh_token_value', minLength: 20 })
    @IsString()
    @MinLength(20)
    refreshToken: string;
}
