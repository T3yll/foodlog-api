import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './create-food-item.dto';
import { UpdateFoodItemDto } from './update-food-item.dto';

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  async create(@Body() createFoodItemDto: CreateFoodItemDto) {
    const createdFoodItem = await this.foodItemsService.create(createFoodItemDto);
    return {
      statusCode: 201,
      message: 'Food item created successfully',
      data: createdFoodItem,
    };
  }

  @Get()
  async findAll() {
    const foodItems = await this.foodItemsService.findAll();
    return {
      statusCode: 200,
      message: 'Food items retrieved successfully',
      data: foodItems,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foodItem = await this.foodItemsService.findOne(id);
    return {
      statusCode: 200,
      message: 'Food item retrieved successfully',
      data: foodItem,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() UpdateFoodItemDto: UpdateFoodItemDto) {
    const updatedFoodItem = await this.foodItemsService.update(id, UpdateFoodItemDto);
    return {
      statusCode: 200,
      message: 'Food item updated successfully',
      data: updatedFoodItem,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.foodItemsService.remove(id);
    return {
      statusCode: 200,
      message: 'Food item deleted successfully',
    };
  }
}
