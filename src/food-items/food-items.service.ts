import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodItem } from './food-item.entity';
import { CreateFoodItemDto } from './create-food-item.dto';

@Injectable()
export class FoodItemsService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemsRepository: Repository<FoodItem>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    const foodItem = this.foodItemsRepository.create(createFoodItemDto);
    return await this.foodItemsRepository.save(foodItem);
  }

  async findAll(): Promise<FoodItem[]> {
    return this.foodItemsRepository.find();
  }
}
