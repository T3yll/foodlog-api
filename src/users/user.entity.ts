import { Meal } from 'src/meals/meal.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column()
  activityLevel: string;

  @Column()
  goal: string;

  @OneToMany(() => Meal, meal => meal.user)
  meals: Meal[];
}
