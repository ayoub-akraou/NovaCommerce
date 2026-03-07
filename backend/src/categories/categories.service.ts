import slugify from 'slugify';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private toSlug(value: string): string {
    return slugify.default(value, {lower: true, strict: true, trim: true})
  }

  create(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const slug = this.toSlug(name);

    return this.prisma.category.create({
      data: { name, slug },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

