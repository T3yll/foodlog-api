import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFoodItemDto {
  @IsString()
  name: string;

  @IsNumber()
  calories: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fat: number;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}
