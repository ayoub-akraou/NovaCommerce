import slugify from 'slugify';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

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

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateCategoryDto) {
    const data: { name?: string; slug?: string } = {};

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      data.name = name;
      data.slug = this.toSlug(name);
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

