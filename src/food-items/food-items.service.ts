import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFoodItemDto } from "./create-food-item.dto";
import { UpdateFoodItemDto } from "./update-food-item.dto";
import { FoodItem } from "./food-item.entity";

@Injectable()
export class FoodItemsService {
  constructor(
    @InjectRepository(FoodItem)
    private readonly foodItemsRepository: Repository<FoodItem>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    try {
      const newFoodItem = this.foodItemsRepository.create(createFoodItemDto);
      return await this.foodItemsRepository.save(newFoodItem);
    } catch (error) {
      throw new BadRequestException('Failed to create food item');
    }
  }

  async findAll(): Promise<FoodItem[]> {
    return await this.foodItemsRepository.find();
  }

  async findOne(id: string): Promise<FoodItem> {
    const foodItem = await this.foodItemsRepository.findOne({ where: { id: Number(id) } });
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return foodItem;
  }

  async update(id: string, updateFoodItemDto: UpdateFoodItemDto): Promise<FoodItem> {
    const foodItem = await this.findOne(id); // Vérifie si l'élément existe
    try {
      const updatedFoodItem = this.foodItemsRepository.merge(foodItem, updateFoodItemDto);
      return await this.foodItemsRepository.save(updatedFoodItem);
    } catch (error) {
      throw new BadRequestException(`Failed to update food item with ID ${id}`);
    }
  }

  async remove(id: string): Promise<void> {
    const foodItem = await this.findOne(id); // Vérifie si l'élément existe
    try {
      await this.foodItemsRepository.remove(foodItem);
    } catch (error) {
      throw new BadRequestException(`Failed to delete food item with ID ${id}`);
    }
  }
}
