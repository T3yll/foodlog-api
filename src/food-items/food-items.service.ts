import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFoodItemDto } from "./create-food-item.dto";
import { FoodItem } from "./food-item.entity";


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
