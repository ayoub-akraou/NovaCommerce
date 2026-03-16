import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { CartService } from './cart.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart returned successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  getMyCart(@Req() req: any) {
    return this.cartService.getOrCreateUserCart(req.user.sub);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiResponse({ status: 400, description: 'Invalid payload or out of stock' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  addItem(@Req() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  @ApiResponse({ status: 400, description: 'Invalid quantity or payload' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  updateItem(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(req.user.sub, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Cart item removed' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeItem(@Req() req: any, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.sub, id);
  }
}
