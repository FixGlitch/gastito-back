import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777759894914 implements MigrationInterface {
    name = 'InitialSchema1777759894914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create enum only if it doesn't exist
        await queryRunner.query(`
          DO $$ BEGIN
            CREATE TYPE "public"."expenses_category_enum" AS ENUM('alimentos', 'transporte', 'sube', 'servicios', 'entretenimiento', 'salud', 'educacion', 'hogar', 'ropa', 'otros');
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying NOT NULL, "avatarUrl" character varying(500), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "salary_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "monthlySalary" numeric(15,2) NOT NULL DEFAULT '0', "savingsPercentage" numeric(5,2) NOT NULL DEFAULT '20', "inflationAdjustmentPercent" numeric(5,2) NOT NULL DEFAULT '0', "quincenaDay" integer NOT NULL DEFAULT '1', "lastInflationApplied" numeric(5,2), "lastInflationAppliedDate" date, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_724532575eb339956714d8d6aec" UNIQUE ("user_id"), CONSTRAINT "REL_724532575eb339956714d8d6ae" UNIQUE ("user_id"), CONSTRAINT "PK_34aa57ebe01436536a63f0e1ba6" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "savings_goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "targetAmount" numeric(15,2) NOT NULL, "currentAmount" numeric(15,2) NOT NULL DEFAULT '0', "targetDate" date, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_4f1e133521cfbf2b4252bd8f09d" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(200) NOT NULL, "amount" numeric(15,2) NOT NULL, "category" "public"."expenses_category_enum" NOT NULL DEFAULT 'otros', "date" date NOT NULL, "notes" character varying(500), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);

        // Add foreign keys only if they don't exist
        await queryRunner.query(`
          DO $$ BEGIN
            ALTER TABLE "expenses" ADD CONSTRAINT "FK_49a0ca239d34e74fdc4e0625a78" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
        await queryRunner.query(`
          DO $$ BEGIN
            ALTER TABLE "salary_profiles" ADD CONSTRAINT "FK_724532575eb339956714d8d6aec" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION;
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
        await queryRunner.query(`
          DO $$ BEGIN
            ALTER TABLE "savings_goals" ADD CONSTRAINT "FK_acf18d62676b7b640f44cc6eba5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
          EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "savings_goals" DROP CONSTRAINT "FK_acf18d62676b7b640f44cc6eba5"`);
        await queryRunner.query(`ALTER TABLE "salary_profiles" DROP CONSTRAINT "FK_724532575eb339956714d8d6aec"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_49a0ca239d34e74fdc4e0625a78"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "savings_goals"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "salary_profiles"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "expenses"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."expenses_category_enum"`);
    }
}
