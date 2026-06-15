import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity("savings_goals")
export class SavingsGoal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  targetAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: "date", nullable: true })
  targetDate: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.savingsGoals, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: string;

  get progress(): number {
    if (this.targetAmount <= 0) return 0;
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
  }

  get remaining(): number {
    return Math.max(this.targetAmount - this.currentAmount, 0);
  }
}
