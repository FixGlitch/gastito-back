import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../entities/expense.entity";
import {
  CreateExpenseRequestDto,
  UpdateExpenseRequestDto,
  ExpenseFiltersRequestDto,
} from "../dto/request/expense.request";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async findAll(
    userId: string,
    filters?: ExpenseFiltersRequestDto,
  ): Promise<Expense[]> {
    const query = this.expenseRepository
      .createQueryBuilder("expense")
      .where("expense.userId = :userId", { userId })
      .orderBy("expense.date", "DESC");

    if (filters?.category) {
      query.andWhere("expense.category = :category", {
        category: filters.category,
      });
    }

    if (filters?.month) {
      const [year, month] = filters.month.split("-").map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.andWhere("expense.date BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      });
    }

    if (filters?.search) {
      query.andWhere("expense.description ILIKE :search", {
        search: `%${filters.search}%`,
      });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere("expense.date BETWEEN :start AND :end", {
        start: new Date(filters.startDate),
        end: new Date(filters.endDate),
      });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, userId },
    });
    if (!expense) {
      throw new NotFoundException("Gasto no encontrado");
    }
    return expense;
  }

  async create(
    userId: string,
    dto: CreateExpenseRequestDto,
  ): Promise<Expense> {
    const categoryName = dto.category?.toLowerCase().trim() || "varios";

    const expense = this.expenseRepository.create({
      description: dto.description,
      amount: dto.amount,
      category: categoryName,
      userId,
      date: new Date(dto.date + "T12:00:00"),
      notes: dto.notes,
    });
    return this.expenseRepository.save(expense);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateExpenseRequestDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id, userId);

    if (dto.description !== undefined) expense.description = dto.description;
    if (dto.amount !== undefined) expense.amount = dto.amount;
    if (dto.date !== undefined) expense.date = new Date(dto.date + "T12:00:00");
    if (dto.notes !== undefined) expense.notes = dto.notes;
    if (dto.category !== undefined) expense.category = dto.category.toLowerCase().trim();

    return this.expenseRepository.save(expense);
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expenseRepository.remove(expense);
  }

  async getSummary(
    userId: string,
    month?: string,
  ): Promise<{
    total: number;
    byCategory: Record<string, number>;
    count: number;
    categoryDetails: Array<{
      category: string;
      label: string;
      total: number;
      count: number;
      percentage: number;
    }>;
  }> {
    const query = this.expenseRepository
      .createQueryBuilder("expense")
      .select("SUM(expense.amount)", "total")
      .addSelect("COUNT(*)", "count")
      .where("expense.userId = :userId", { userId });

    if (month) {
      const [year, mon] = month.split("-").map(Number);
      const startDate = new Date(year, mon - 1, 1);
      const endDate = new Date(year, mon, 0);
      query.andWhere("expense.date BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();
    const total = parseFloat(result.total ?? "0");
    const count = parseInt(result.count ?? "0", 10);

    const byCategoryQuery = this.expenseRepository
      .createQueryBuilder("expense")
      .select("expense.category", "category")
      .addSelect("SUM(expense.amount)", "total")
      .addSelect("COUNT(*)", "count")
      .where("expense.userId = :userId", { userId });

    if (month) {
      const [year, mon] = month.split("-").map(Number);
      const startDate = new Date(year, mon - 1, 1);
      const endDate = new Date(year, mon, 0);
      byCategoryQuery.andWhere("expense.date BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      });
    }

    byCategoryQuery.groupBy("expense.category");
    const categoryResults = await byCategoryQuery.getRawMany();

    const categoryDetails = categoryResults.map((row) => ({
      category: row.category,
      label: row.category,
      total: parseFloat(row.total),
      count: parseInt(row.count, 10),
      percentage: total > 0 ? (parseFloat(row.total) / total) * 100 : 0,
    }));

    const byCategory: Record<string, number> = {};
    categoryDetails.forEach((cat) => {
      byCategory[cat.category] = cat.total;
    });

    return { total, byCategory, count, categoryDetails };
  }
}
