import slugify from 'slugify';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private toSlug(value: string): string {
    return slugify.default(value, {lower: true, strict: true, trim: true})
  }

  }
