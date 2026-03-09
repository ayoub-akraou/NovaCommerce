import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

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

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateProductDto) {
    const data: {
      categoryId?: string;
      title?: string;
      slug?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
    } = {};

    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.title !== undefined) {
      const title = dto.title.trim();
      data.title = title;
      data.slug = this.toSlug(title);
    }
    if (dto.description !== undefined)
      data.description = dto.description.trim();
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.images !== undefined) data.images = dto.images;

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
