import { IsString, IsNotEmpty, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  type: string; // petit-déj, déjeuner, snack, dîner

  @IsDateString()
  datetime: Date;

  @IsArray()
  @IsOptional()
  foodItemIds?: number[]; // IDs des aliments à associer au repas
}