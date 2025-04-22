import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  calories: number;

  @Column()
  protein: number;

  @Column()
  carbs: number;

  @Column()
  fat: number;

  @Column()
  quantity: number;

  @Column()
  unit: string;
}
