import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaySummaryController } from './day-summary.controller';
import { DaySummary } from './day-summary.entity';
import { NutritionModule } from '../nutrition/nutrition.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaySummary]),
    NutritionModule,
  ],
  controllers: [DaySummaryController],
  providers: [],
  exports: [],
})
export class DaySummaryModule {}