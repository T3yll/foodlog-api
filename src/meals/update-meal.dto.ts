export class UpdateMealDto {
  readonly type?: string;
  readonly datetime?: string; // Accepte une chaîne pour simplifier l'entrée
  readonly foodItems?: { id: number }[]; // Liste des FoodItems (par ID)
}