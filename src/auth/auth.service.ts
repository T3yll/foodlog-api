import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    weight: number;
    height: number;
    age: number;
    sex: string;
    activityLevel: string;
    goal: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, ...userInfo } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer le nouvel utilisateur
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...userInfo,
    });

    const savedUser = await this.userRepository.save(user);

    // Générer le token JWT
    const payload: JwtPayload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: this.formatUserResponse(savedUser),
    };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Trouver l'utilisateur
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: this.formatUserResponse(user),
    };
  }

  /**
   * Valider un utilisateur (pour la stratégie Local)
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  /**
   * Valider un payload JWT (pour la stratégie JWT)
   */
  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub }
    });

    if (!user) {
      throw new UnauthorizedException('Token invalide');
    }

    return user;
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['meals', 'daySummaries']
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userId: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Ne pas permettre la modification de l'email et du mot de passe ici
    const { email, password, ...allowedUpdates } = updateData;
    
    Object.assign(user, allowedUpdates);
    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(
    userId: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    await this.userRepository.save(user);
  }

  /**
   * Formater la réponse utilisateur (sans le mot de passe)
   */
  private formatUserResponse(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}