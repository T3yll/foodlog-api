import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class DaySummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column()
  totalCalories: number;

  @Column()
  totalProtein: number;

  @Column()
  totalCarbs: number;

  @Column()
  totalFat: number;

  @Column()
  status: string; // under_goal, balanced, over_goal
}
