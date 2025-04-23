import { Controller, Post, Get, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './create-meal.dto';
import { UpdateMealDto } from './update-meal.dto';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  async create(@Body() createMealDto: CreateMealDto) {
    const createdMeal = await this.mealsService.create(createMealDto);
    return {
      statusCode: 201,
      message: 'Meal created successfully',
      data: createdMeal,
    };
  }

  @Get()
  async findAll(@Query('date') date?: string) {
    const meals = await this.mealsService.findAll(date);
    return {
      statusCode: 200,
      message: 'Meals retrieved successfully',
      data: meals,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const meal = await this.mealsService.findOne(id);
    return {
      statusCode: 200,
      message: 'Meal retrieved successfully',
      data: meal,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMealDto: UpdateMealDto) {
    const updatedMeal = await this.mealsService.update(id, updateMealDto);
    return {
      statusCode: 200,
      message: 'Meal updated successfully',
      data: updatedMeal,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.mealsService.remove(id);
    return {
      statusCode: 200,
      message: 'Meal deleted successfully',
    };
  }

  @Delete(':mealId/food-items/:foodItemId')
  async removeFoodItem(
    @Param('mealId') mealId: number,
    @Param('foodItemId') foodItemId: number,
  ) {
    await this.mealsService.removeFoodItem(mealId, foodItemId);
    return {
      statusCode: 200,
      message: `Food item with ID ${foodItemId} removed from meal with ID ${mealId} successfully`,
    };
  }
}