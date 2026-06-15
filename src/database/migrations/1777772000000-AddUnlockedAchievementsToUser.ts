import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnlockedAchievementsToUser1777772000000 implements MigrationInterface {
  name = "AddUnlockedAchievementsToUser1777772000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "unlockedAchievements" text array DEFAULT '{}'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "unlockedAchievements"`);
  }
}
