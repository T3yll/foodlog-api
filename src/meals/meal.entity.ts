import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { FoodItem } from '../food-items/food-item.entity';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // petit-déj, déjeuner, dîner...

  @Column()
  datetime: Date;

  @ManyToOne(() => User, user => user.meals, { eager: true })
  user: User;

  @ManyToMany(() => FoodItem, { eager: true })
  @JoinTable()
  foodItems: FoodItem[];
}
