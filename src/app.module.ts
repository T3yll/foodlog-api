import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { DaySummaryModule } from './day-summary/day-summary.module';
import { FoodItem } from './food-items/food-item.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // permet d'accéder à env partout sans devoir le réimporter
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // ou mysql, sqlite, etc.
      host: 'db',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'foodlog',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    MealsModule,
    FoodItemsModule,
    DaySummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
