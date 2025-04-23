import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { FoodItemsModule } from 'src/food-items/food-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal]),
    FoodItemsModule // Import de l'entité Meal pour TypeORM
  ],
  providers: [MealsService],
  controllers: [MealsController],
  exports: [TypeOrmModule, MealsService], // Export du service si utilisé ailleurs
})
export class MealsModule {}
