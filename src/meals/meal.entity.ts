import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // petit-déj, déjeuner, dîner...

  @Column()
  datetime: Date;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column("json")
  foodItems: any[]; // Liens vers les food items
}
