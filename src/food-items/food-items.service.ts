// src/food-items/food-items.service.ts (mise à jour)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { FoodItem } from './food-item.entity';
import { CreateFoodItemDto } from './create-food-item.dto';
import { UpdateFoodItemDto } from './update-food-item.dto';

@Injectable()
export class FoodItemsService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    const foodItem = this.foodItemRepository.create(createFoodItemDto);
    return await this.foodItemRepository.save(foodItem);
  }

  async findAll(): Promise<FoodItem[]> {
    return await this.foodItemRepository.find();
  }

  /**
   * Recherche d'aliments par nom (insensible à la casse)
   */
  async search(query: string): Promise<FoodItem[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    return await this.foodItemRepository.find({
      where: {
        name: Like(`%${query}%`)
      },
      take: 20, // Limite à 20 résultats
      order: {
        name: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }

    return foodItem;
  }

  async update(id: string, updateFoodItemDto: UpdateFoodItemDto): Promise<FoodItem> {
    const foodItem = await this.findOne(id);
    
    Object.assign(foodItem, updateFoodItemDto);
    
    return await this.foodItemRepository.save(foodItem);
  }

  async remove(id: string): Promise<void> {
    const foodItem = await this.findOne(id);
    await this.foodItemRepository.remove(foodItem);
  }

  /**
   * Créer des aliments de base pour les tests
   */
  async seedBasicFoods(): Promise<void> {
    const basicFoods = [
      { name: 'Riz blanc cuit', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, quantity: 100, unit: 'g' },
      { name: 'Blanc de poulet', calories: 165, protein: 31, carbs: 0, fat: 3.6, quantity: 100, unit: 'g' },
      { name: 'Œuf entier', calories: 155, protein: 13, carbs: 1.1, fat: 11, quantity: 100, unit: 'g' },
      { name: 'Brocolis', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, quantity: 100, unit: 'g' },
      { name: 'Banane', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, quantity: 100, unit: 'g' },
      { name: 'Avoine', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, quantity: 100, unit: 'g' },
      { name: 'Saumon', calories: 208, protein: 22, carbs: 0, fat: 13, quantity: 100, unit: 'g' },
      { name: 'Amandes', calories: 579, protein: 21, carbs: 22, fat: 50, quantity: 100, unit: 'g' },
      { name: 'Yaourt grec nature', calories: 59, protein: 10, carbs: 4, fat: 0.4, quantity: 100, unit: 'g' },
      { name: 'Épinards', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, quantity: 100, unit: 'g' },
      { name: 'Pain complet', calories: 247, protein: 13, carbs: 41, fat: 4.2, quantity: 100, unit: 'g' },
      { name: 'Lentilles cuites', calories: 116, protein: 9, carbs: 20, fat: 0.4, quantity: 100, unit: 'g' },
      { name: 'Huile d\'olive', calories: 884, protein: 0, carbs: 0, fat: 100, quantity: 100, unit: 'ml' },
      { name: 'Fromage blanc 0%', calories: 45, protein: 8, carbs: 4, fat: 0.2, quantity: 100, unit: 'g' },
      { name: 'Quinoa cuit', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, quantity: 100, unit: 'g' }
    ];

    for (const food of basicFoods) {
      const exists = await this.foodItemRepository.findOne({
        where: { name: food.name }
      });

      if (!exists) {
        await this.foodItemRepository.save(food);
      }
    }
  }
}