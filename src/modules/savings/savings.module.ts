import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SavingsGoal } from "./entities/savings-goal.entity";
import { SavingsController } from "./controllers/savings.controller";
import { SavingsService } from "./services/savings.service";

@Module({
  imports: [TypeOrmModule.forFeature([SavingsGoal])],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [SavingsService],
})
export class SavingsModule {}
