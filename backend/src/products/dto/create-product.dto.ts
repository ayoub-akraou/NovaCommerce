import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'cat_123' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Mechanical Keyboard', minLength: 2, maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional({ example: 'RGB keyboard with blue switches', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 129.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 50, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: ['https://cdn.example.com/img-1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
