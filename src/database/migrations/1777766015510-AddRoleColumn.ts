import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumn1777766015510 implements MigrationInterface {
    name = 'AddRoleColumn1777766015510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum only if not exists
        await queryRunner.query(`
          DO $$ BEGIN
            CREATE TYPE "public"."budgets_period_enum" AS ENUM('daily', 'weekly', 'monthly');
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);

        // Create budgets table if not exists
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "budgets" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "period" "public"."budgets_period_enum" NOT NULL,
            "amount" numeric(10,2) NOT NULL,
            "category" character varying(50) NOT NULL,
            "userId" uuid NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_9c8a51748f82387644b773da482" PRIMARY KEY ("id")
          )
        `);

        // Create role enum only if not exists
        await queryRunner.query(`
          DO $$ BEGIN
            CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin');
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);

        // Add role column if not exists
        await queryRunner.query(`
          DO $$ BEGIN
            ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user';
          EXCEPTION WHEN duplicate_column THEN null; END $$;
        `);

        // Add foreign key if not exists
        await queryRunner.query(`
          DO $$ BEGIN
            ALTER TABLE "budgets" ADD CONSTRAINT "FK_27e688ddf1ff3893b43065899f9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT IF EXISTS "FK_27e688ddf1ff3893b43065899f9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "budgets"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."budgets_period_enum"`);
    }
}
