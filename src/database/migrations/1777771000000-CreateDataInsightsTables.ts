import { MigrationInterface, QueryRunner, Table, Index } from "typeorm";

export class CreateDataInsightsTables1777771000000 implements MigrationInterface {
  name = "CreateDataInsightsTables1777771000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sponsored_content table
    await queryRunner.createTable(
      new Table({
        name: "sponsored_content",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
          },
          {
            name: "content",
            type: "text",
          },
          {
            name: "category",
            type: "varchar",
            length: "100",
          },
          {
            name: "advertiser_id",
            type: "varchar",
            length: "255",
          },
          {
            name: "impressions",
            type: "int",
            default: 0,
          },
          {
            name: "clicks",
            type: "int",
            default: 0,
          },
          {
            name: "start_date",
            type: "date",
          },
          {
            name: "end_date",
            type: "date",
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          {
            name: "IDX_sponsored_category",
            columnNames: ["category"],
          },
        ],
      })
    );

    // Create data_reports table
    await queryRunner.createTable(
      new Table({
        name: "data_reports",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "period",
            type: "varchar",
            length: "50",
          },
          {
            name: "geography",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "category",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "insights_json",
            type: "json",
          },
          {
            name: "buyer_id",
            type: "varchar",
            length: "255",
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'pending'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "sold_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
        indices: [
          {
            name: "IDX_report_period",
            columnNames: ["period"],
          },
          {
            name: "IDX_report_status",
            columnNames: ["status"],
          },
        ],
      })
    );

    // Create consumer_trends table
    await queryRunner.createTable(
      new Table({
        name: "consumer_trends",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "category",
            type: "varchar",
            length: "100",
          },
          {
            name: "geography",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "date",
            type: "date",
          },
          {
            name: "average_spending",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "transaction_count",
            type: "int",
          },
          {
            name: "growth_rate",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "demographics",
            type: "json",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          {
            name: "IDX_trend_category",
            columnNames: ["category"],
          },
          {
            name: "IDX_trend_date",
            columnNames: ["date"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("consumer_trends");
    await queryRunner.dropTable("data_reports");
    await queryRunner.dropTable("sponsored_content");
  }
}
