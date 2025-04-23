import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';
import { FoodItem } from '../food-items/food-item.entity';
import { CreateMealDto } from './create-meal.dto';
import { UpdateMealDto } from './update-meal.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
    @InjectRepository(FoodItem)
    private readonly foodItemsRepository: Repository<FoodItem>, // Ajout du repository FoodItem
  ) {}

  async create(createMealDto: CreateMealDto): Promise<Meal> {
    try {
      // Récupérer les FoodItems depuis la base de données
      const foodItems = await this.foodItemsRepository.findByIds(
        createMealDto.foodItems.map(item => item.id),
      );

      if (foodItems.length !== createMealDto.foodItems.length) {
        throw new BadRequestException('Some FoodItems do not exist');
      }

      // Créer le repas avec les FoodItems
      const newMeal = this.mealsRepository.create({
        ...createMealDto,
        datetime: new Date(createMealDto.datetime),
        foodItems,
      });

      return await this.mealsRepository.save(newMeal);
    } catch (error) {
      throw new BadRequestException('Failed to create meal');
    }
  }

  async findAll(date?: string): Promise<Meal[]> {
    try {
      if (date) {
        return await this.mealsRepository.find({
          where: { datetime: new Date(date) },
          relations: ['user'], // Inclut les relations (ex: User)
        });
      }
      return await this.mealsRepository.find({ relations: ['user'] });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve meals');
    }
  }

  async findOne(id: number): Promise<Meal> {
    const meal = await this.mealsRepository.findOne({
      where: { id },
      relations: ['user'], // Inclut les relations (ex: User)
    });
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    return meal;
  }

  async update(id: number, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findOne(id); // Vérifie si le repas existe
  
    try {
      // Si des FoodItems sont fournis, les récupérer depuis la base de données
      if (updateMealDto.foodItems) {
        const foodItems = await this.foodItemsRepository.findByIds(
          updateMealDto.foodItems.map(item => item.id),
        );
  
        if (foodItems.length !== updateMealDto.foodItems.length) {
          throw new BadRequestException('Some FoodItems do not exist in the database');
        }
  
        // Supprimer toutes les relations existantes avec les FoodItems
        await this.mealsRepository.createQueryBuilder()
          .relation(Meal, 'foodItems')
          .of(meal)
          .remove(meal.foodItems);
  
        // Ajouter uniquement les FoodItems spécifiés
        await this.mealsRepository.createQueryBuilder()
          .relation(Meal, 'foodItems')
          .of(meal)
          .add(foodItems);
      }
  
      // Mettre à jour les autres champs du repas
      const updatedMeal = this.mealsRepository.merge(meal, {
        type: updateMealDto.type ?? meal.type,
        datetime: updateMealDto.datetime ? new Date(updateMealDto.datetime) : meal.datetime,
      });
  
      return await this.mealsRepository.save(updatedMeal);
    } catch (error) {
      throw new BadRequestException(`Failed to update meal with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    const meal = await this.findOne(id); // Vérifie si le repas existe
  
    try {
      // Supprimer les relations entre le repas et les FoodItems
      await this.mealsRepository.createQueryBuilder()
        .relation(Meal, 'foodItems')
        .of(meal)
        .remove(meal.foodItems);
  
      // Supprimer le repas
      await this.mealsRepository.remove(meal);
    } catch (error) {
      throw new BadRequestException(`Failed to delete meal with ID ${id}`);
    }
  }

  async removeFoodItem(mealId: number, foodItemId: number): Promise<void> {
    const meal = await this.findOne(mealId); // Vérifie si le repas existe
  
    const foodItem = await this.foodItemsRepository.findOne({ where: { id: foodItemId } });
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${foodItemId} not found`);
    }
  
    try {
      // Supprimer la relation entre le repas et le FoodItem
      await this.mealsRepository.createQueryBuilder()
        .relation(Meal, 'foodItems')
        .of(meal)
        .remove(foodItem);
    } catch (error) {
      throw new BadRequestException(
        `Failed to remove food item with ID ${foodItemId} from meal with ID ${mealId}: ${error.message}`,
      );
    }
  }
}
