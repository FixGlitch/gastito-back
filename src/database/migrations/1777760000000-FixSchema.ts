import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSchema1777760000000 implements MigrationInterface {
    name = 'FixSchema1777760000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // expenses.category is already varchar from synchronize, just ensure default is correct
        await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "category" SET DEFAULT 'Varios'`);

        // Drop the enum type if it exists (cleanup, since we use varchar now)
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."expenses_category_enum"`);

        // Create expense_categories table if not exists
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "expense_categories" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(100) NOT NULL,
            "color" character varying(7) NOT NULL DEFAULT '#6B7280',
            "icon" character varying(50),
            "isActive" boolean NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_expense_categories" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_expense_categories_name" UNIQUE ("name")
          )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "expense_categories"`);
    }
}
