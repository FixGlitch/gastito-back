import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumnsToExpenses1777767200000 implements MigrationInterface {
  name = "AddMissingColumnsToExpenses1777767200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add deletedAt column
    await queryRunner.query(`
      ALTER TABLE "expenses"
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ DEFAULT NULL;
    `);

    // Add category_id column
    await queryRunner.query(`
      ALTER TABLE "expenses"
      ADD COLUMN IF NOT EXISTS "category_id" uuid DEFAULT NULL;
    `);

    // Add foreign key constraint for category_id
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "expenses"
        ADD CONSTRAINT "FK_expenses_category_id"
        FOREIGN KEY ("category_id") REFERENCES "expense_categories"("id");
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expenses"
      DROP CONSTRAINT IF EXISTS "FK_expenses_category_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "expenses"
      DROP COLUMN IF EXISTS "category_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "expenses"
      DROP COLUMN IF EXISTS "deletedAt";
    `);
  }
}
