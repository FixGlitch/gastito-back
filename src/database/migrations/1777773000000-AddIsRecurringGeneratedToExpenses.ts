import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsRecurringGeneratedToExpenses1777773000000 implements MigrationInterface {
  name = "AddIsRecurringGeneratedToExpenses1777773000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "isRecurringGenerated" boolean DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN IF EXISTS "isRecurringGenerated"`);
  }
}
