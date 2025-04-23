import { Controller, Post, Body } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './create-food-item.dto';

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  async create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemsService.create(createFoodItemDto);
  }
}
