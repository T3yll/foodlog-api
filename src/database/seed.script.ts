import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FoodItemsSeeder } from './food-items.seed';

async function bootstrap() {
  console.log('🚀 Starting seeding process...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const foodItemsSeeder = app.get(FoodItemsSeeder);
    await foodItemsSeeder.seed();
    
    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();