import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity("expenses")
export class Expense {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 200 })
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 100, default: "Varios" })
  category: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ length: 500, nullable: true })
  notes: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.expenses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: string;
}
