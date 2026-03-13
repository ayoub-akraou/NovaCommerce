import { Controller } from '@nestjs/common';
import { AdminStatsService } from './admin-stats.service.js';

@Controller('admin-stats')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}
}
