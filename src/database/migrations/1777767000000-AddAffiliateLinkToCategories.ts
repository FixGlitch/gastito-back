import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAffiliateLinkToCategories1777767000000 implements MigrationInterface {
  name = "AddAffiliateLinkToCategories1777767000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expense_categories"
      ADD COLUMN "affiliateLink" character varying(500) DEFAULT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expense_categories"
      DROP COLUMN "affiliateLink";
    `);
  }
}
