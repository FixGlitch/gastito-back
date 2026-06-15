import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToCategories1777775000000 implements MigrationInterface {
    name = 'AddUserIdToCategories1777775000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar columna userId
        await queryRunner.query(`ALTER TABLE "expense_categories" ADD COLUMN IF NOT EXISTS "userId" uuid`);

        // Eliminar la restricción única existente en name
        await queryRunner.query(`ALTER TABLE "expense_categories" DROP CONSTRAINT IF EXISTS "UQ_expense_categories_name"`);

        // Crear un índice único parcial para categorías del sistema (userId IS NULL)
        await queryRunner.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_expense_categories_system_name"
          ON "expense_categories" ("name")
          WHERE "userId" IS NULL
        `);

        // Agregar clave foránea hacia users
        await queryRunner.query(`
          ALTER TABLE "expense_categories"
          ADD CONSTRAINT "FK_expense_categories_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id")
          ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense_categories" DROP CONSTRAINT IF EXISTS "FK_expense_categories_user"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_categories_system_name"`);
        await queryRunner.query(`ALTER TABLE "expense_categories" DROP COLUMN IF EXISTS "userId"`);
        await queryRunner.query(`ALTER TABLE "expense_categories" ADD CONSTRAINT "UQ_expense_categories_name" UNIQUE ("name")`);
    }
}
