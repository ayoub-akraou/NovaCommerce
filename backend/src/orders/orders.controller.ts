import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { ListAdminOrdersQueryDto } from './dto/list-admin-orders-query.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from current user cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Cart empty or insufficient stock' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.sub, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'Orders returned successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  findMyOrders(@Req() req: any) {
    return this.ordersService.findMyOrders(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one order belonging to current user' })
  @ApiResponse({ status: 200, description: 'Order returned successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOneForUser(req.user.sub, id);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Pay pending order (mock payment)' })
  @ApiResponse({ status: 200, description: 'Order paid successfully' })
  @ApiResponse({ status: 400, description: 'Order is not pending' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  markAsPaid(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.markOrderAsPaid(req.user.sub, id);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all orders for admin with optional filters' })
  @ApiResponse({ status: 200, description: 'Admin orders list returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  findAllForAdmin(@Query() query: ListAdminOrdersQueryDto) {
    return this.ordersService.findAllForAdmin(query);
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update order status as admin' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }
}
