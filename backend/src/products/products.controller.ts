import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { ListProductsQueryDto } from './dto/list-products-query.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create product (admin)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 409, description: 'Product slug already exists' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List products with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Products list returned' })
  findAll(@Query() query: ListProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product returned' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update product by id (admin)' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by id (admin)' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
