import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodItem } from "./food-item.entity";
import { FoodItemsController } from "./food-items.controller";
import { FoodItemsService } from "./food-items.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodItem]),
  ],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
  exports: [TypeOrmModule, FoodItemsService],
})
export class FoodItemsModule {}
