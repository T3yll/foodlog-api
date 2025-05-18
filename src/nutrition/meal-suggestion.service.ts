import { Injectable } from '@nestjs/common';
import { DayNutrition, NutritionalGoals } from './nutrition-calculator.service';

export interface CompensatoryMeal {
  name: string;
  foodItems: Array<{
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

@Injectable()
export class MealSuggestionService {
  
  // Base de données d'aliments compensatoires
  private compensatoryFoods = [
    { name: 'Œuf entier', calories: 155, protein: 13, carbs: 1, fat: 11, unit: 'pièce', baseQuantity: 1 },
    { name: 'Yaourt grec 0%', calories: 59, protein: 10, carbs: 4, fat: 0.2, unit: 'g', baseQuantity: 100 },
    { name: 'Blanc de poulet', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: 'g', baseQuantity: 100 },
    { name: 'Amandes', calories: 579, protein: 21, carbs: 22, fat: 50, unit: 'g', baseQuantity: 30 },
    { name: 'Cottage cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, unit: 'g', baseQuantity: 100 },
    { name: 'Thon en conserve', calories: 116, protein: 26, carbs: 0, fat: 1, unit: 'g', baseQuantity: 100 },
    { name: 'Fromage blanc 0%', calories: 45, protein: 8, carbs: 4, fat: 0.2, unit: 'g', baseQuantity: 100 },
    { name: 'Noix', calories: 618, protein: 15, carbs: 14, fat: 59, unit: 'g', baseQuantity: 30 },
    { name: 'Lentilles cuites', calories: 116, protein: 9, carbs: 20, fat: 0.4, unit: 'g', baseQuantity: 100 },
    { name: 'Quinoa cuit', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, unit: 'g', baseQuantity: 100 }
  ];

  /**
   * Génère un repas compensatoire basé sur les manques nutritionnels
   */
  generateCompensatoryMeal(
    currentNutrition: DayNutrition, 
    goals: NutritionalGoals
  ): CompensatoryMeal | null {
    
    const proteinDeficit = Math.max(0, goals.protein - currentNutrition.totalProtein);
    const calorieDeficit = Math.max(0, goals.calories - currentNutrition.totalCalories);

    // Si pas de déficit significatif, pas de suggestion
    if (proteinDeficit < 10 && calorieDeficit < 200) {
      return null;
    }

    const selectedFoods: Array<{
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      unit: string;
      baseQuantity: number;
      quantity: number;
    }> = [];
    let remainingProtein = proteinDeficit;
    let remainingCalories = calorieDeficit;

    // Algorithme de sélection d'aliments
    // Prioriser les protéines si déficit important
    if (proteinDeficit > 15) {
      // Ajouter une source de protéine de qualité
      const proteinFood = this.compensatoryFoods.find(food => 
        food.protein > 20 && food.calories < 200
      );
      if (proteinFood) {
        const quantity = Math.min(
          Math.ceil(remainingProtein / proteinFood.protein) * proteinFood.baseQuantity,
          200
        );
        selectedFoods.push({ ...proteinFood, quantity });
        remainingProtein -= (proteinFood.protein * quantity / proteinFood.baseQuantity);
        remainingCalories -= (proteinFood.calories * quantity / proteinFood.baseQuantity);
      }
    }

    // Compléter avec des aliments équilibrés
    if (remainingProtein > 5 || remainingCalories > 100) {
      const balancedFoods = this.compensatoryFoods.filter(food => 
        food.protein > 8 && food.protein < 15
      );
      
      for (const food of balancedFoods) {
        if (remainingProtein <= 0 && remainingCalories <= 50) break;
        
        const quantity = food.baseQuantity;
        selectedFoods.push({ ...food, quantity });
        remainingProtein -= food.protein;
        remainingCalories -= food.calories;
      }
    }

    // Calculer les totaux du repas suggéré
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const foodItems = selectedFoods.map(food => {
      const factor = food.quantity / food.baseQuantity;
      totalCalories += food.calories * factor;
      totalProtein += food.protein * factor;
      totalCarbs += food.carbs * factor;
      totalFat += food.fat * factor;

      return {
        name: food.name,
        quantity: food.quantity,
        unit: food.unit,
        calories: Math.round(food.calories * factor),
        protein: Math.round(food.protein * factor),
        carbs: Math.round(food.carbs * factor),
        fat: Math.round(food.fat * factor)
      };
    });

    return {
      name: 'Repas compensatoire suggéré',
      foodItems,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat)
    };
  }
}