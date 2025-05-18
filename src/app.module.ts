import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { DaySummaryModule } from './day-summary/day-summary.module';
import { FoodItem } from './food-items/food-item.entity';
import { NutritionModule } from './nutrition/nutrition.module';
import { FoodItemsSeeder } from './database/food-items.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([FoodItem]),
    AuthModule,
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