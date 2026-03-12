import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { Roles } from 'src/auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.sub, dto);
  }

  @Get('me')
  findMyOrders(@Req() req: any) {
    return this.ordersService.findMyOrders(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOneForUser(req.user.sub, id);
  }

  @Patch(':id/pay')
  markAsPaid(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.markOrderAsPaid(req.user.sub, id);
  }

  @Patch('admin/:id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }
}
