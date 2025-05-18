// src/nutrition/nutrition-calculator.service.ts
import { Injectable } from '@nestjs/common';

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  sex: 'male' | 'female';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  goal: 'maintenance' | 'weight_loss' | 'weight_gain';
}

export interface NutritionalGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayNutrition {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

@Injectable()
export class NutritionCalculatorService {
  
  /**
   * Calcule le métabolisme basal (BMR) selon la formule Mifflin-St Jeor
   */
  calculateBMR(user: UserProfile): number {
    const { weight, height, age, sex } = user;
    
    if (sex === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  /**
   * Calcule la dépense énergétique totale quotidienne (TDEE)
   */
  calculateTDEE(user: UserProfile): number {
    const bmr = this.calculateBMR(user);
    const activityMultipliers = {
      sedentary: 1.2,
      moderate: 1.55,
      active: 1.75
    };
    
    return bmr * activityMultipliers[user.activityLevel];
  }

  /**
   * Calcule les objectifs nutritionnels basés sur le TDEE et les objectifs de l'utilisateur
   */
  calculateNutritionalGoals(user: UserProfile): NutritionalGoals {
    const tdee = this.calculateTDEE(user);
    let targetCalories = tdee;

    // Ajustement selon l'objectif
    switch (user.goal) {
      case 'weight_loss':
        targetCalories = tdee * 0.8; // Déficit de 20%
        break;
      case 'weight_gain':
        targetCalories = tdee * 1.15; // Surplus de 15%
        break;
      case 'maintenance':
      default:
        targetCalories = tdee;
        break;
    }

    // Répartition des macronutriments
    const proteinCalories = targetCalories * 0.25; // 25% protéines
    const fatCalories = targetCalories * 0.25; // 25% lipides
    const carbCalories = targetCalories * 0.50; // 50% glucides

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinCalories / 4), // 1g protéine = 4 kcal
      carbs: Math.round(carbCalories / 4), // 1g glucide = 4 kcal
      fat: Math.round(fatCalories / 9) // 1g lipide = 9 kcal
    };
  }

  /**
   * Calcule la nutrition totale d'une liste de repas
   */
  calculateDayNutrition(meals: any[]): DayNutrition {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(meal => {
      meal.foodItems.forEach(item => {
        // Conversion basée sur la quantité (ramener à 100g de base)
        const factor = item.quantity / 100;
        totalCalories += item.calories * factor;
        totalProtein += item.protein * factor;
        totalCarbs += item.carbs * factor;
        totalFat += item.fat * factor;
      });
    });

    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat)
    };
  }

  /**
   * Détermine le statut d'une journée par rapport aux objectifs
   */
  calculateDayStatus(dayNutrition: DayNutrition, goals: NutritionalGoals): string {
    const caloriePercentage = (dayNutrition.totalCalories / goals.calories) * 100;
    const proteinPercentage = (dayNutrition.totalProtein / goals.protein) * 100;

    // Logique métier : refus si dépassement de 30% des calories OU moins de 70% des protéines
    if (caloriePercentage > 130) {
      return 'extreme_over';
    }
    
    if (proteinPercentage < 70) {
      return 'under_goal';
    }

    if (caloriePercentage > 110) {
      return 'over_goal';
    }

    if (caloriePercentage >= 90 && caloriePercentage <= 110 && proteinPercentage >= 90) {
      return 'balanced';
    }

    return 'under_goal';
  }
}