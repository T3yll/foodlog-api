import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { DaySummaryModule } from './day-summary/day-summary.module';

@Module({
  imports: [UsersModule, MealsModule, FoodItemsModule, DaySummaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
