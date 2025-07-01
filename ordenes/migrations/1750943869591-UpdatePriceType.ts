import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePriceType1750943869591 implements MigrationInterface {
  name = 'UpdatePriceType1750943869591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orden" DROP COLUMN "total"`);
    await queryRunner.query(
      `ALTER TABLE "orden" ADD "total" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orden_item" DROP COLUMN "precio_unitario"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orden_item" ADD "precio_unitario" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "precio"`);
    await queryRunner.query(
      `ALTER TABLE "producto" ADD "precio" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orden_item" DROP COLUMN "precio_unitario"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orden_item" ADD "precio_unitario" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "precio"`);
    await queryRunner.query(
      `ALTER TABLE "producto" ADD "precio" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "orden" DROP COLUMN "total"`);
    await queryRunner.query(`ALTER TABLE "orden" ADD "total" integer NOT NULL`);
  }
}
