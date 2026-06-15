import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToSavingsGoals1777774000000 implements MigrationInterface {
  name = "AddDeletedAtToSavingsGoals1777774000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "savings_goals" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "savings_goals" DROP COLUMN IF EXISTS "deletedAt"`);
  }
}
