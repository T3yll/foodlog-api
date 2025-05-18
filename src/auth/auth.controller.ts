// src/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inscription
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      statusCode: 201,
      message: 'Utilisateur créé avec succès',
      data: result,
    };
  }

  /**
   * Connexion
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      statusCode: 200,
      message: 'Connexion réussie',
      data: result,
    };
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    const profile = await this.authService.getProfile(user.id);
    return {
      statusCode: 200,
      message: 'Profil récupéré avec succès',
      data: profile,
    };
  }

  /**
   * Mettre à jour le profil
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const updatedUser = await this.authService.updateProfile(user.id, updateProfileDto);
    return {
      statusCode: 200,
      message: 'Profil mis à jour avec succès',
      data: updatedUser,
    };
  }

  /**
   * Changer le mot de passe
   */
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    await this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword
    );

    return {
      statusCode: 200,
      message: 'Mot de passe changé avec succès',
    };
  }

  /**
   * Vérifier le token (route de test)
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User) {
    return {
      statusCode: 200,
      message: 'Token valide',
      data: {
        id: user.id,
        email: user.email,
        tokenValid: true,
      },
    };
  }
}