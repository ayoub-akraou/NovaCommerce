import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '221B Baker Street, London', minLength: 5 })
  @IsString()
  @MinLength(5)
  address: string;
}
