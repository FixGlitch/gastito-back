import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAffiliatesTables1777770000000 implements MigrationInterface {
  name = "CreateAffiliatesTables1777770000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create merchant_affiliates table
    await queryRunner.createTable(
      new Table({
        name: "merchant_affiliates",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
          },
          {
            name: "category",
            type: "varchar",
            length: "100",
          },
          {
            name: "affiliate_link",
            type: "text",
          },
          {
            name: "commission_rate",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: "logo_url",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "metadata",
            type: "json",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          {
            name: "IDX_merchant_name",
            columnNames: ["name"],
          },
          {
            name: "IDX_merchant_category",
            columnNames: ["category"],
          },
        ],
      })
    );

    // Create user_cashback table
    await queryRunner.createTable(
      new Table({
        name: "user_cashback",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "merchant_id",
            type: "uuid",
          },
          {
            name: "expense_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "amount",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "commission_rate",
            type: "decimal",
            precision: 5,
            scale: 2,
          },
          {
            name: "commission_earned",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'pending'",
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "paid_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
        indices: [
          {
            name: "IDX_cashback_user_id",
            columnNames: ["user_id"],
          },
          {
            name: "IDX_cashback_merchant_id",
            columnNames: ["merchant_id"],
          },
          {
            name: "IDX_cashback_status",
            columnNames: ["status"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_cashback");
    await queryRunner.dropTable("merchant_affiliates");
  }
}
