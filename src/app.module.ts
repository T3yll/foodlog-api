import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { DaySummaryModule } from './day-summary/day-summary.module';
import { FoodItem } from './food-items/food-item.entity';
import { ConfigModule } from '@nestjs/config';
import { NutritionModule } from './nutrition/nutrition.module';
import { FoodItemsSeeder } from './database/food-items.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'foodlog',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([FoodItem]),
    AuthModule, // Ajout du module d'authentification
    UsersModule,
    MealsModule,
    FoodItemsModule,
    DaySummaryModule,
    NutritionModule,
  ],
  controllers: [AppController],
  providers: [AppService, FoodItemsSeeder],
})
export class AppModule {}