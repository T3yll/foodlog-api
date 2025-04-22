import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
