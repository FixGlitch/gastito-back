import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../modules/user/entities/user.entity";
import { Expense } from "../modules/expense/entities/expense.entity";
import { SavingsGoal } from "../modules/savings/entities/savings-goal.entity";
import { AppDataSource } from "./data-source";

async function seed() {
  const dataSource = await AppDataSource.initialize();

  try {
    const userRepo = dataSource.getRepository(User);
    const expenseRepo = dataSource.getRepository(Expense);
    const savingsRepo = dataSource.getRepository(SavingsGoal);

    const existingUser = await userRepo.findOne({ where: { email: "demo@gastito.com" } });
    if (existingUser) {
      const cleanTables = [
        "savings_goals", "expenses", "salary_profiles",
        "budgets", "expense_categories", "user_achievements",
        "alerts_settings",
      ];
      for (const table of cleanTables) {
        try {
          await dataSource.query(`DELETE FROM "${table}" WHERE "user_id" = $1`, [existingUser.id]);
        } catch {
          try {
            await dataSource.query(`DELETE FROM "${table}" WHERE "userId" = $1`, [existingUser.id]);
          } catch {
            // table doesn't exist or has no user column — skip
          }
        }
      }
      await dataSource.query(`DELETE FROM "users" WHERE "id" = $1`, [existingUser.id]);
    }

    const hashedPassword = await bcrypt.hash("demo123456", 10);
    const user = userRepo.create({
      name: "Juan Pérez",
      email: "demo@gastito.com",
      password: hashedPassword,
    });
    await userRepo.save(user);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    await expenseRepo.save([
      expenseRepo.create({
        description: "Mercado - Compra semanal",
        amount: 15000,
        category: "Alimentos",
        userId: user.id,
        date: new Date(year, month, 5),
      }),
      expenseRepo.create({
        description: "Cine con amigos",
        amount: 8000,
        category: "Ocio",
        userId: user.id,
        date: new Date(year, month, 12),
      }),
      expenseRepo.create({
        description: "Uber al trabajo",
        amount: 3500,
        category: "Transporte",
        userId: user.id,
        date: new Date(year, month, 20),
      }),
    ]);

    await savingsRepo.save(
      savingsRepo.create({
        userId: user.id,
        name: "Vacaciones",
        targetAmount: 1000000,
        currentAmount: 250000,
        targetDate: new Date(year + 1, 11, 31),
      }),
    );

    console.log("Seed completado — demo@gastito.com / demo123456");

  } catch (error) {
    console.error("Error durante el seed:", error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });
