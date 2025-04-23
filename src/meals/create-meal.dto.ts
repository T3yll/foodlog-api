import { FoodItem } from '../food-items/food-item.entity';

export class CreateMealDto {
  readonly type: string; // petit-déj, déjeuner, dîner...
  readonly datetime: string; // Format simplifié pour la date
  readonly userId: number; // ID de l'utilisateur
  readonly foodItems: FoodItem[]; // Liste complète des FoodItems
}