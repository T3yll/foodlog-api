import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Meal } from '../meals/meal.entity';
import { DaySummary } from '../day-summary/day-summary.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('float')
  weight: number;

  @Column('float')
  height: number;

  @Column()
  age: number;

  @Column()
  sex: string; // 'male' | 'female'

  @Column()
  activityLevel: string; // 'sedentary' | 'moderate' | 'active'

  @Column()
  goal: string; // 'maintenance' | 'weight_loss' | 'weight_gain'

  @OneToMany(() => Meal, meal => meal.user)
  meals: Meal[];

  @OneToMany(() => DaySummary, summary => summary.user)
  daySummaries: DaySummary[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}