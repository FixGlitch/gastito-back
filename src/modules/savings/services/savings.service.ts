import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SavingsGoal } from "../entities/savings-goal.entity";
import { CreateSavingsGoalRequestDto, UpdateSavingsGoalRequestDto } from "../dto/request/savings.request";

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private readonly savingsGoalRepository: Repository<SavingsGoal>,
  ) {}

  async findAll(userId: string): Promise<SavingsGoal[]> {
    return this.savingsGoalRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string, userId: string): Promise<SavingsGoal> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id, userId } });
    if (!goal) {
      throw new NotFoundException("Meta de ahorro no encontrada");
    }
    return goal;
  }

  async create(userId: string, dto: CreateSavingsGoalRequestDto): Promise<SavingsGoal> {
    const goal = this.savingsGoalRepository.create({
      name: dto.name,
      targetAmount: dto.targetAmount,
      userId,
      currentAmount: 0,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
    });
    const saved = await this.savingsGoalRepository.save(goal);

    return saved;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateSavingsGoalRequestDto,
  ): Promise<SavingsGoal> {
    const goal = await this.findOne(id, userId);

    if (dto.currentAmount !== undefined) {
      goal.currentAmount = dto.currentAmount;
    }
    if (dto.targetDate) {
      goal.targetDate = new Date(dto.targetDate);
    }
    if (dto.name !== undefined) goal.name = dto.name;
    if (dto.targetAmount !== undefined) goal.targetAmount = dto.targetAmount;
    if (dto.isActive !== undefined) goal.isActive = dto.isActive;

    const saved = await this.savingsGoalRepository.save(goal);

    return saved;
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);
    await this.savingsGoalRepository.remove(goal);
  }

  async getProjection(userId: string, monthlySavings: number): Promise<{
    threeMonths: number;
    sixMonths: number;
    twelveMonths: number;
  }> {
    const goals = await this.findAll(userId);
    const currentTotal = goals.reduce((sum, g) => sum + Number(g.currentAmount), 0);

    return {
      threeMonths: currentTotal + monthlySavings * 3,
      sixMonths: currentTotal + monthlySavings * 6,
      twelveMonths: currentTotal + monthlySavings * 12,
    };
  }
}
