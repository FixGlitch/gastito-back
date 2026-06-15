import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesAndBudgets1777764631448 implements MigrationInterface {
    name = 'AddRolesAndBudgets1777764631448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."budgets_period_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`CREATE TABLE "budgets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "period" "public"."budgets_period_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "category" character varying(50) NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9c8a51748f82387644b773da482" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "budgets" ADD CONSTRAINT "FK_27e688ddf1ff3893b43065899f9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT "FK_27e688ddf1ff3893b43065899f9"`);
        await queryRunner.query(`DROP TABLE "budgets"`);
        await queryRunner.query(`DROP TYPE "public"."budgets_period_enum"`);
    }

}
