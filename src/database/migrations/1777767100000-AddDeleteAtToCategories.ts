import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteAtToCategories1777767100000 implements MigrationInterface {
  name = "AddDeleteAtToCategories1777767100000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expense_categories"
      ADD COLUMN "deletedAt" TIMESTAMPTZ DEFAULT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expense_categories"
      DROP COLUMN "deletedAt";
    `);
  }
}
