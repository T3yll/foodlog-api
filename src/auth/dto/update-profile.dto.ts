import { 
  IsNumber, 
  IsEnum, 
  IsOptional,
  IsPositive,
  Min,
  Max
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber({}, { message: 'Le poids doit être un nombre' })
  @IsPositive({ message: 'Le poids doit être positif' })
  weight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La taille doit être un nombre' })
  @IsPositive({ message: 'La taille doit être positive' })
  height?: number;

  @IsOptional()
  @IsNumber({}, { message: 'L\'âge doit être un nombre' })
  @Min(16, { message: 'L\'âge minimum est de 16 ans' })
  @Max(100, { message: 'L\'âge maximum est de 100 ans' })
  age?: number;

  @IsOptional()
  @IsEnum(['male', 'female'], { message: 'Le sexe doit être "male" ou "female"' })
  sex?: 'male' | 'female';

  @IsOptional()
  @IsEnum(['sedentary', 'moderate', 'active'], { 
    message: 'Le niveau d\'activité doit être "sedentary", "moderate" ou "active"' 
  })
  activityLevel?: 'sedentary' | 'moderate' | 'active';

  @IsOptional()
  @IsEnum(['maintenance', 'weight_loss', 'weight_gain'], { 
    message: 'L\'objectif doit être "maintenance", "weight_loss" ou "weight_gain"' 
  })
  goal?: 'maintenance' | 'weight_loss' | 'weight_gain';
}