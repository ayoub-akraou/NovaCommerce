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

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getMyCart(@Req() req: any) {
    return this.cartService.getOrCreateUserCart(req.user.sub);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Patch('items/:id')
  updateItem(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(req.user.sub, id, dto);
  }

  @Delete('items/:id')
  removeItem(@Req() req: any, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.sub, id);
  }
}
