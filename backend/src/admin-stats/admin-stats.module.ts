import { Module } from '@nestjs/common';
import { AdminStatsService } from './admin-stats.service.js';
import { AdminStatsController } from './admin-stats.controller.js';

@Module({
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
})
export class AdminStatsModule {}
