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

