import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsNumber, 
  IsEnum, 
  IsPositive,
  Min,
  Max
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @IsNumber({}, { message: 'Le poids doit être un nombre' })
  @IsPositive({ message: 'Le poids doit être positif' })
  weight: number;

  @IsNumber({}, { message: 'La taille doit être un nombre' })
  @IsPositive({ message: 'La taille doit être positive' })
  height: number;

  @IsNumber({}, { message: 'L\'âge doit être un nombre' })
  @Min(16, { message: 'L\'âge minimum est de 16 ans' })
  @Max(100, { message: 'L\'âge maximum est de 100 ans' })
  age: number;

  @IsEnum(['male', 'female'], { message: 'Le sexe doit être "male" ou "female"' })
  sex: 'male' | 'female';

  @IsEnum(['sedentary', 'moderate', 'active'], { 
    message: 'Le niveau d\'activité doit être "sedentary", "moderate" ou "active"' 
  })
  activityLevel: 'sedentary' | 'moderate' | 'active';

  @IsEnum(['maintenance', 'weight_loss', 'weight_gain'], { 
    message: 'L\'objectif doit être "maintenance", "weight_loss" ou "weight_gain"' 
  })
  goal: 'maintenance' | 'weight_loss' | 'weight_gain';
}