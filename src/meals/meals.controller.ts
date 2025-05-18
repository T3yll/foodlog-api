import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './create-meal.dto';
import { UpdateMealDto } from './update-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  async create(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User
  ) {
    const createdMeal = await this.mealsService.create(createMealDto, user.id);
    return {
      statusCode: 201,
      message: 'Meal created successfully',
      data: createdMeal,
    };
  }

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('date') date?: string
  ) {
    const meals = await this.mealsService.findAll(user.id, date);
    return {
      statusCode: 200,
      message: 'Meals retrieved successfully',
      data: meals,
    };
  }

  @Get('stats/:date')
  async getDayStats(
    @Param('date') date: string,
    @CurrentUser() user: User
  ) {
    const targetDate = new Date(date);
    const stats = await this.mealsService.getDayNutritionStats(user.id, targetDate);
    
    return {
      statusCode: 200,
      message: 'Day nutrition statistics retrieved successfully',
      data: stats
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @CurrentUser() user: User
  ) {
    const meal = await this.mealsService.findOne(id, user.id);
    return {
      statusCode: 200,
      message: 'Meal retrieved successfully',
      data: meal,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateMealDto: UpdateMealDto,
    @CurrentUser() user: User
  ) {
    const updatedMeal = await this.mealsService.update(id, updateMealDto, user.id);
    return {
      statusCode: 200,
      message: 'Meal updated successfully',
      data: updatedMeal,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: User
  ) {
    await this.mealsService.remove(id, user.id);
    return {
      statusCode: 200,
      message: 'Meal deleted successfully',
    };
  }

  @Delete(':mealId/food-items/:foodItemId')
  async removeFoodItem(
    @Param('mealId') mealId: number,
    @Param('foodItemId') foodItemId: number,
    @CurrentUser() user: User
  ) {
    await this.mealsService.removeFoodItem(mealId, foodItemId, user.id);
    return {
      statusCode: 200,
      message: `Food item with ID ${foodItemId} removed from meal with ID ${mealId} successfully`,
    };
  }
}