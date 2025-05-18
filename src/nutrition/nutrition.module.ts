import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionCalculatorService } from './nutrition-calculator.service';
import { MealSuggestionService } from './meal-suggestion.service';
import { DayValidationService } from './day-validation.service';
import { DaySummary } from '../day-summary/day-summary.entity';
import { Meal } from '../meals/meal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaySummary, Meal])
  ],
  providers: [
    NutritionCalculatorService,
    MealSuggestionService,
    DayValidationService,
  ],
  exports: [
    NutritionCalculatorService,
    MealSuggestionService,
    DayValidationService,
  ],
})
export class NutritionModule {}