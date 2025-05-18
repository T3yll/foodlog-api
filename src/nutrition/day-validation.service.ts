import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DaySummary } from '../day-summary/day-summary.entity';
import { Meal } from '../meals/meal.entity';
import { 
  NutritionCalculatorService, 
  UserProfile, 
  DayNutrition, 
  NutritionalGoals 
} from './nutrition-calculator.service';
import { 
  MealSuggestionService, 
  CompensatoryMeal 
} from './meal-suggestion.service';
import { startOfDay, endOfDay } from 'date-fns';

export interface DayValidationResult {
  isValid: boolean;
  status: string;
  dayNutrition: DayNutrition;
  goals: NutritionalGoals;
  violations: string[];
  suggestion?: CompensatoryMeal;
}

@Injectable()
export class DayValidationService {
  
  constructor(
    private nutritionCalculator: NutritionCalculatorService,
    private mealSuggestion: MealSuggestionService,
    @InjectRepository(DaySummary)
    private daySummaryRepository: Repository<DaySummary>,
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>
  ) {}

  /**
   * Valide une journée et détermine si elle peut être finalisée
   */
  validateDay(
    meals: Meal[], 
    user: UserProfile
  ): DayValidationResult {
    
    const goals = this.nutritionCalculator.calculateNutritionalGoals(user);
    const dayNutrition = this.nutritionCalculator.calculateDayNutrition(meals);
    const status = this.nutritionCalculator.calculateDayStatus(dayNutrition, goals);

    const violations: string[] = [];
    let isValid = true;

    // Vérification du dépassement calorique (>30%)
    const caloriePercentage = (dayNutrition.totalCalories / goals.calories) * 100;
    if (caloriePercentage > 130) {
      violations.push(`Dépassement calorique de ${Math.round(caloriePercentage - 100)}% (maximum autorisé: 30%)`);
      isValid = false;
    }

    // Vérification du déficit protéique (<70%)
    const proteinPercentage = (dayNutrition.totalProtein / goals.protein) * 100;
    if (proteinPercentage < 70) {
      violations.push(`Apport protéique insuffisant: ${Math.round(proteinPercentage)}% (minimum requis: 70%)`);
      isValid = false;
    }

    // Génération d'une suggestion si nécessaire
    let suggestion: CompensatoryMeal | undefined;
    if (!isValid || status === 'under_goal') {
      const result = this.mealSuggestion.generateCompensatoryMeal(dayNutrition, goals);
      suggestion = result === null ? undefined : result;
    }

    return {
      isValid,
      status,
      dayNutrition,
      goals,
      violations,
      suggestion
    };
  }

  /**
   * Met à jour automatiquement le DaySummary
   */
  async updateDaySummary(
    date: Date,
    userId: number,
    meals: Meal[],
    userProfile: UserProfile
  ): Promise<DaySummary> {
    
    const validation = this.validateDay(meals, userProfile);
    
    // Rechercher un résumé existant ou en créer un nouveau
    let daySummary = await this.daySummaryRepository.findOne({
      where: { 
        date: Between(startOfDay(date), endOfDay(date)),
        user: { id: userId } 
      }
    });

    if (!daySummary) {
      daySummary = this.daySummaryRepository.create({
        date,
        user: { id: userId },
        totalCalories: validation.dayNutrition.totalCalories,
        totalProtein: validation.dayNutrition.totalProtein,
        totalCarbs: validation.dayNutrition.totalCarbs,
        totalFat: validation.dayNutrition.totalFat,
        status: validation.status
      });
    } else {
      // Mettre à jour les valeurs existantes
      daySummary.totalCalories = validation.dayNutrition.totalCalories;
      daySummary.totalProtein = validation.dayNutrition.totalProtein;
      daySummary.totalCarbs = validation.dayNutrition.totalCarbs;
      daySummary.totalFat = validation.dayNutrition.totalFat;
      daySummary.status = validation.status;
    }

    return await this.daySummaryRepository.save(daySummary);
  }

  /**
   * Récupère les repas d'une journée pour un utilisateur
   */
  async getMealsForDay(userId: number, date: Date): Promise<Meal[]> {
    return await this.mealRepository.find({
      where: { 
        user: { id: userId },
        datetime: Between(
          startOfDay(date),
          endOfDay(date)
        )
      },
      relations: ['foodItems', 'user']
    });
  }

  /**
   * Calcule les objectifs nutritionnels pour un utilisateur
   */
  calculateUserGoals(userProfile: UserProfile): NutritionalGoals {
    return this.nutritionCalculator.calculateNutritionalGoals(userProfile);
  }
}