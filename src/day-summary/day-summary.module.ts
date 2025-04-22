import { Module } from '@nestjs/common';
import { DaySummaryService } from './day-summary.service';
import { DaySummaryController } from './day-summary.controller';

@Module({
  providers: [DaySummaryService],
  controllers: [DaySummaryController]
})
export class DaySummaryModule {}
