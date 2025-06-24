import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750785562477 implements MigrationInterface {
    name = 'InitialMigration1750785562477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."inventario_tipo_enum" AS ENUM('ENTRADA', 'SALIDA')`);
        await queryRunner.query(`CREATE TABLE "inventario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "tipo" "public"."inventario_tipo_enum" NOT NULL, "cantidad" integer NOT NULL, "motivo" text, "productoId" uuid, CONSTRAINT "PK_90f2b8f62985685e15fea12e237" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cliente" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "nombre" text NOT NULL, "correo" text NOT NULL, "direccion" text NOT NULL, CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orden_estado_enum" AS ENUM('pendiente', 'despachado', 'pagado')`);
        await queryRunner.query(`CREATE TABLE "orden" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "estado" "public"."orden_estado_enum" NOT NULL DEFAULT 'pendiente', "total" integer NOT NULL, "clienteId" uuid, CONSTRAINT "PK_7dc2f9c066419f6f0782cafb454" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orden_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "cantidad" integer NOT NULL, "precio_unitario" integer NOT NULL, "ordenId" uuid, "productoId" uuid, CONSTRAINT "PK_79e04580be66940cff739030e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "codigo" text NOT NULL, "nombre" text NOT NULL, "descripcion" text NOT NULL, "precio" integer NOT NULL, CONSTRAINT "PK_5be023b11909fe103e24c740c7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cobro_estado_enum" AS ENUM('pendiente', 'despachado', 'pagado')`);
        await queryRunner.query(`CREATE TABLE "cobro" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "estado" "public"."cobro_estado_enum" NOT NULL DEFAULT 'pendiente', "metodo_pago" text NOT NULL, "ordenId" uuid, CONSTRAINT "REL_8e653bac6bb624412d1d48941b" UNIQUE ("ordenId"), CONSTRAINT "PK_afe79ff5606a8a476c6f74aa9cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."despacho_estado_enum" AS ENUM('pendiente', 'en preparacion', 'enviado', 'listo')`);
        await queryRunner.query(`CREATE TABLE "despacho" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "estado" "public"."despacho_estado_enum" NOT NULL DEFAULT 'pendiente', "fecha_preparacion" TIMESTAMP WITH TIME ZONE, "fecha_envio" TIMESTAMP WITH TIME ZONE, "ordenId" uuid, CONSTRAINT "REL_a2f8ded9bebbcd649e9e3d1a7f" UNIQUE ("ordenId"), CONSTRAINT "PK_7173d81c4956b1a2c21c30d447d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."envio_estado_enum" AS ENUM('pendiente', 'enviado', 'entregado')`);
        await queryRunner.query(`CREATE TABLE "envio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "estado" "public"."envio_estado_enum" NOT NULL DEFAULT 'pendiente', "transportista" text NOT NULL, "numero_guia" text NOT NULL, "fecha_envio" TIMESTAMP WITH TIME ZONE, "fecha_entrega" TIMESTAMP WITH TIME ZONE, "despachoId" uuid, CONSTRAINT "REL_67cc7bb6b8f28e56c1de215c4a" UNIQUE ("despachoId"), CONSTRAINT "PK_a4c3fbd6861b8d2b52ecd4c1945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventario" ADD CONSTRAINT "FK_d6de9c097bfff5a10525924cd80" FOREIGN KEY ("productoId") REFERENCES "producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orden" ADD CONSTRAINT "FK_2dcaad1dfddd9ca83c80c657bb7" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orden_item" ADD CONSTRAINT "FK_123a9f5116917948727f94f2689" FOREIGN KEY ("ordenId") REFERENCES "orden"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orden_item" ADD CONSTRAINT "FK_b81c8ee26a8bd3146061e392959" FOREIGN KEY ("productoId") REFERENCES "producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cobro" ADD CONSTRAINT "FK_8e653bac6bb624412d1d48941b1" FOREIGN KEY ("ordenId") REFERENCES "orden"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "despacho" ADD CONSTRAINT "FK_a2f8ded9bebbcd649e9e3d1a7fa" FOREIGN KEY ("ordenId") REFERENCES "orden"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "envio" ADD CONSTRAINT "FK_67cc7bb6b8f28e56c1de215c4a2" FOREIGN KEY ("despachoId") REFERENCES "despacho"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "envio" DROP CONSTRAINT "FK_67cc7bb6b8f28e56c1de215c4a2"`);
        await queryRunner.query(`ALTER TABLE "despacho" DROP CONSTRAINT "FK_a2f8ded9bebbcd649e9e3d1a7fa"`);
        await queryRunner.query(`ALTER TABLE "cobro" DROP CONSTRAINT "FK_8e653bac6bb624412d1d48941b1"`);
        await queryRunner.query(`ALTER TABLE "orden_item" DROP CONSTRAINT "FK_b81c8ee26a8bd3146061e392959"`);
        await queryRunner.query(`ALTER TABLE "orden_item" DROP CONSTRAINT "FK_123a9f5116917948727f94f2689"`);
        await queryRunner.query(`ALTER TABLE "orden" DROP CONSTRAINT "FK_2dcaad1dfddd9ca83c80c657bb7"`);
        await queryRunner.query(`ALTER TABLE "inventario" DROP CONSTRAINT "FK_d6de9c097bfff5a10525924cd80"`);
        await queryRunner.query(`DROP TABLE "envio"`);
        await queryRunner.query(`DROP TYPE "public"."envio_estado_enum"`);
        await queryRunner.query(`DROP TABLE "despacho"`);
        await queryRunner.query(`DROP TYPE "public"."despacho_estado_enum"`);
        await queryRunner.query(`DROP TABLE "cobro"`);
        await queryRunner.query(`DROP TYPE "public"."cobro_estado_enum"`);
        await queryRunner.query(`DROP TABLE "producto"`);
        await queryRunner.query(`DROP TABLE "orden_item"`);
        await queryRunner.query(`DROP TABLE "orden"`);
        await queryRunner.query(`DROP TYPE "public"."orden_estado_enum"`);
        await queryRunner.query(`DROP TABLE "cliente"`);
        await queryRunner.query(`DROP TABLE "inventario"`);
        await queryRunner.query(`DROP TYPE "public"."inventario_tipo_enum"`);
    }

}
