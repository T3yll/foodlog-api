import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateFoodItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  calories: number;

  @IsNumber()
  @IsPositive()
  protein: number;

  @IsNumber()
  @IsPositive()
  carbs: number;

  @IsNumber()
  @IsPositive()
  fat: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}