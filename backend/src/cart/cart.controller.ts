import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
