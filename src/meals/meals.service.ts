import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Meal } from './meal.entity';
import { CreateMealDto } from './create-meal.dto';
import { UpdateMealDto } from './update-meal.dto';
import { DayValidationService } from '../nutrition/day-validation.service';
import { UserProfile } from '../nutrition/nutrition-calculator.service';
import { startOfDay, endOfDay } from 'date-fns';
import { User } from '../users/user.entity';
import { FoodItem } from '../food-items/food-item.entity';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
    private dayValidationService: DayValidationService,
  ) {}

  async create(createMealDto: CreateMealDto, userId: number): Promise<Meal> {
    const { foodItemIds, ...mealData } = createMealDto;

    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Récupérer les aliments si des IDs sont fournis
    let foodItems: FoodItem[] = [];
    if (foodItemIds && foodItemIds.length > 0) {
      foodItems = await this.foodItemRepository.find({
        where: { id: In(foodItemIds) }
      });

      // Vérifier que tous les aliments ont été trouvés
      if (foodItems.length !== foodItemIds.length) {
        const foundIds = foodItems.map(item => item.id);
        const missingIds = foodItemIds.filter(id => !foundIds.includes(id));
        throw new NotFoundException(`Aliments non trouvés: ${missingIds.join(', ')}`);
      }
    }

    // Créer le repas avec les aliments
    const meal = this.mealRepository.create({
      ...mealData,
      user,
      foodItems, // Association des aliments
    });
    
    const savedMeal = await this.mealRepository.save(meal);

    // Auto-calcul du résumé de la journée après ajout d'un repas
    await this.updateDaySummaryAfterMealChange(savedMeal);

    // Retourner le repas avec les relations chargées
    const foundMeal = await this.mealRepository.findOne({
      where: { id: savedMeal.id },
      relations: ['foodItems', 'user']
    });

    if (!foundMeal) {
      throw new NotFoundException('Erreur lors de la création du repas');
    }

    return foundMeal;
  }

  async findAll(userId: number, date?: string): Promise<Meal[]> {
    const queryBuilder = this.mealRepository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.foodItems', 'foodItems')
      .leftJoinAndSelect('meal.user', 'user')
      .where('meal.user.id = :userId', { userId });

    if (date) {
      const targetDate = new Date(date);
      queryBuilder.andWhere('meal.datetime BETWEEN :start AND :end', {
        start: startOfDay(targetDate),
        end: endOfDay(targetDate),
      });
    }

    return await queryBuilder
      .orderBy('meal.datetime', 'DESC')
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['foodItems', 'user']
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    // Vérifier que le repas appartient à l'utilisateur
    if (meal.user.id !== userId) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce repas');
    }

    return meal;
  }

  async update(id: number, updateMealDto: UpdateMealDto, userId: number): Promise<Meal> {
    const meal = await this.findOne(id, userId); // Vérifie déjà l'appartenance
    const { foodItemIds, ...mealData } = updateMealDto;

    // Mettre à jour les données du repas
    Object.assign(meal, mealData);

    // Mettre à jour les aliments si des IDs sont fournis
    if (foodItemIds !== undefined) {
      if (foodItemIds.length > 0) {
        const foodItems = await this.foodItemRepository.find({
          where: { id: In(foodItemIds) }
        });

        // Vérifier que tous les aliments ont été trouvés
        if (foodItems.length !== foodItemIds.length) {
          const foundIds = foodItems.map(item => item.id);
          const missingIds = foodItemIds.filter(id => !foundIds.includes(id));
          throw new NotFoundException(`Aliments non trouvés: ${missingIds.join(', ')}`);
        }

        meal.foodItems = foodItems;
      } else {
        // Si foodItemIds est un tableau vide, supprimer tous les aliments
        meal.foodItems = [];
      }
    }

    const updatedMeal = await this.mealRepository.save(meal);

    // Auto-calcul du résumé de la journée après modification d'un repas
    await this.updateDaySummaryAfterMealChange(updatedMeal);

    const foundMeal = await this.mealRepository.findOne({
      where: { id: updatedMeal.id },
      relations: ['foodItems', 'user']
    });

    if (!foundMeal) {
      throw new NotFoundException('Erreur lors de la mise à jour du repas');
    }

    return foundMeal;
  }

  async remove(id: number, userId: number): Promise<void> {
    const meal = await this.findOne(id, userId); // Vérifie déjà l'appartenance
    
    // Sauvegarder les informations nécessaires avant suppression
    const mealDate = meal.datetime;
    const mealUserId = meal.user.id;
    
    await this.mealRepository.remove(meal);

    // Auto-calcul du résumé de la journée après suppression d'un repas
    await this.updateDaySummaryAfterMealChange(undefined, mealDate, mealUserId);
  }

  async removeFoodItem(mealId: number, foodItemId: number, userId: number): Promise<void> {
    const meal = await this.findOne(mealId, userId); // Vérifie déjà l'appartenance
    
    meal.foodItems = meal.foodItems.filter(item => item.id !== foodItemId);
    const updatedMeal = await this.mealRepository.save(meal);

    // Auto-calcul du résumé de la journée après modification des aliments
    await this.updateDaySummaryAfterMealChange(updatedMeal);
  }

  /**
   * Met à jour automatiquement le DaySummary après tout changement de repas
   */
  private async updateDaySummaryAfterMealChange(
    meal?: Meal, 
    date?: Date, 
    userId?: number
  ): Promise<void> {
    try {
      // Déterminer la date et l'utilisateur
      const targetDate = meal ? meal.datetime : date;
      const targetUserId = meal ? meal.user.id : userId;

      if (!targetDate || !targetUserId) {
        return;
      }

      // Récupérer les informations de l'utilisateur pour calculer les objectifs
      const user = await this.userRepository.findOne({ where: { id: targetUserId } });
      if (!user) {
        return;
      }

      const userProfile: UserProfile = {
        weight: user.weight,
        height: user.height,
        age: user.age,
        sex: user.sex as 'male' | 'female',
        activityLevel: user.activityLevel as 'sedentary' | 'moderate' | 'active',
        goal: user.goal as 'maintenance' | 'weight_loss' | 'weight_gain'
      };

      // Récupérer tous les repas de la journée
      const mealsOfDay = await this.dayValidationService.getMealsForDay(
        targetUserId,
        targetDate
      );

      // Mettre à jour le résumé de la journée
      await this.dayValidationService.updateDaySummary(
        targetDate,
        targetUserId,
        mealsOfDay,
        userProfile
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du résumé de la journée:', error);
      // Ne pas faire échouer la requête principale si le calcul du résumé échoue
    }
  }

  /**
   * Obtient les statistiques nutritionnelles d'une journée pour un utilisateur
   */
  async getDayNutritionStats(userId: number, date: Date) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const meals = await this.dayValidationService.getMealsForDay(userId, date);

    const userProfile: UserProfile = {
      weight: user.weight,
      height: user.height,
      age: user.age,
      sex: user.sex as 'male' | 'female',
      activityLevel: user.activityLevel as 'sedentary' | 'moderate' | 'active',
      goal: user.goal as 'maintenance' | 'weight_loss' | 'weight_gain'
    };

    const validation = this.dayValidationService.validateDay(meals, userProfile);
    const goals = this.dayValidationService.calculateUserGoals(userProfile);

    return {
      meals: meals.length,
      nutrition: validation.dayNutrition,
      goals,
      status: validation.status,
      violations: validation.violations,
      suggestion: validation.suggestion
    };
  }
}