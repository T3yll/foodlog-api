import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  UseGuards, 
  BadRequestException 
} from '@nestjs/common';
import { DayValidationService } from '../nutrition/day-validation.service';
import { UserProfile } from '../nutrition/nutrition-calculator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('day-summary')
@UseGuards(JwtAuthGuard) // Protection de toutes les routes
export class DaySummaryController {
  constructor(
    private readonly dayValidationService: DayValidationService
  ) {}

  /**
   * Récupère le résumé nutritionnel d'une journée pour l'utilisateur connecté
   */
  @Get(':date')
  async getDaySummary(
    @Param('date') date: string,
    @CurrentUser() user: User
  ) {
    const targetDate = new Date(date);
    const meals = await this.dayValidationService.getMealsForDay(user.id, targetDate);

    // Utiliser les vraies données utilisateur
    const userProfile: UserProfile = {
      weight: user.weight,
      height: user.height,
      age: user.age,
      sex: user.sex as 'male' | 'female',
      activityLevel: user.activityLevel as 'sedentary' | 'moderate' | 'active',
      goal: user.goal as 'maintenance' | 'weight_loss' | 'weight_gain'
    };

    // Calcul des objectifs personnalisés
    const goals = this.dayValidationService.calculateUserGoals(userProfile);
    
    // Validation de la journée
    const validation = this.dayValidationService.validateDay(meals, userProfile);
    
    return {
      statusCode: 200,
      message: 'Day summary retrieved successfully',
      data: {
        date: targetDate,
        nutrition: validation.dayNutrition,
        goals: goals,
        status: validation.status,
        isValid: validation.isValid,
        violations: validation.violations,
        suggestion: validation.suggestion,
        mealsCount: meals.length
      }
    };
  }

  /**
   * Valide une journée nutritionnelle pour l'utilisateur connecté
   */
  @Post(':date/validate')
  async validateDay(
    @Param('date') date: string,
    @CurrentUser() user: User
  ) {
    const targetDate = new Date(date);
    const meals = await this.dayValidationService.getMealsForDay(user.id, targetDate);

    const userProfile: UserProfile = {
      weight: user.weight,
      height: user.height,
      age: user.age,
      sex: user.sex as 'male' | 'female',
      activityLevel: user.activityLevel as 'sedentary' | 'moderate' | 'active',
      goal: user.goal as 'maintenance' | 'weight_loss' | 'weight_gain'
    };

    const validation = this.dayValidationService.validateDay(meals, userProfile);

    if (!validation.isValid) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'La journée ne peut pas être validée',
        violations: validation.violations,
        suggestion: validation.suggestion
      });
    }

    // Mettre à jour le résumé de la journée
    await this.dayValidationService.updateDaySummary(
      targetDate,
      user.id,
      meals,
      userProfile
    );

    return { 
      statusCode: 200,
      message: 'Journée validée avec succès',
      data: {
        status: validation.status,
        nutrition: validation.dayNutrition
      }
    };
  }

  /**
   * Obtient une suggestion de repas compensatoire pour l'utilisateur connecté
   */
  @Get(':date/suggestions')
  async getCompensatoryMeal(
    @Param('date') date: string,
    @CurrentUser() user: User
  ) {
    const targetDate = new Date(date);
    const meals = await this.dayValidationService.getMealsForDay(user.id, targetDate);

    const userProfile: UserProfile = {
      weight: user.weight,
      height: user.height,
      age: user.age,
      sex: user.sex as 'male' | 'female',
      activityLevel: user.activityLevel as 'sedentary' | 'moderate' | 'active',
      goal: user.goal as 'maintenance' | 'weight_loss' | 'weight_gain'
    };

    const validation = this.dayValidationService.validateDay(meals, userProfile);
    
    if (!validation.suggestion) {
      return {
        statusCode: 200,
        message: 'Aucune suggestion nécessaire, votre journée est équilibrée !',
        data: null
      };
    }

    return {
      statusCode: 200,
      message: 'Suggestion de repas compensatoire générée',
      data: validation.suggestion
    };
  }

  /**
   * Calcule les besoins caloriques et objectifs nutritionnels pour l'utilisateur connecté
   */
  @Get('goals/calculate')
  async calculateGoals(@CurrentUser() user: User) {
    const userProfile: UserProfile = {
      weight: user.weight,
      height: user.height,
      age: user.age,
      sex: user.sex as 'male' | 'female',
      activityLevel: user.activityLevel as 'sedentary' | 'moderate' | 'active',
      goal: user.goal as 'maintenance' | 'weight_loss' | 'weight_gain'
    };

    const goals = this.dayValidationService.calculateUserGoals(userProfile);
    
    return {
      statusCode: 200,
      message: 'Nutritional goals calculated successfully',
      data: {
        goals,
        userProfile: {
          weight: user.weight,
          height: user.height,
          age: user.age,
          sex: user.sex,
          activityLevel: user.activityLevel,
          goal: user.goal
        }
      }
    };
  }
}