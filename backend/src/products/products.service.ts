import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ListProductsQueryDto } from './dto/list-products-query.dto.js';

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

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.categoryId = query.category;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    const orderBy =
      query.sort === 'price_asc'
        ? { price: 'asc' as const }
        : query.sort === 'price_desc'
          ? { price: 'desc' as const }
          : { createdAt: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
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
