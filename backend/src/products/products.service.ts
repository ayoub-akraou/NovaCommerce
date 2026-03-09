import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private toSlug(value: string): string {
    return slugify.default(value, { lower: true, strict: true, trim: true });
  }

  create(dto: CreateProductDto) {
    const title = dto.title.trim();

    return this.prisma.product.create({
      data: {
        categoryId: dto.categoryId,
        title,
        slug: this.toSlug(title),
        description: dto.description?.trim(),
        price: dto.price,
        stock: dto.stock ?? 0,
        images: dto.images ?? [],
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

