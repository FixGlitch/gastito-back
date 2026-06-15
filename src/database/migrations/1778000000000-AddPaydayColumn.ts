import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaydayColumn1778000000000 implements MigrationInterface {
    name = 'AddPaydayColumn1778000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salary_profiles" ADD "payday" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salary_profiles" DROP COLUMN "payday"`);
    }
}
