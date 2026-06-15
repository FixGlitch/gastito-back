import { Module } from "@nestjs/common";
import { ExpenseController } from "./controllers/expense.controller";
import { ExpenseService } from "./services/expense.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "./entities/expense.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
