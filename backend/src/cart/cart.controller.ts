import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { CartService } from './cart.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

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
}
