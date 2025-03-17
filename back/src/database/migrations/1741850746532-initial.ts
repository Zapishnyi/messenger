import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1741850746532 implements MigrationInterface {
    name = 'Initial1741850746532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "access" text NOT NULL, "refresh" text NOT NULL, "device" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_41e9ddfbb32da18c4e85e45c2fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "message" text, "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "nick_name" text, "email" text NOT NULL, "password" text NOT NULL, "last_visit" date, CONSTRAINT "UQ_878678f951ec57decddec263213" UNIQUE ("nick_name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "user_contacts" ("user_id" uuid NOT NULL, "contact_id" uuid NOT NULL, CONSTRAINT "PK_92ea2d9087efe59427afad40139" PRIMARY KEY ("user_id", "contact_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a81491e712124db8d5423803ec" ON "user_contacts" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_367bf9e66e36b0ee1680e8dfa6" ON "user_contacts" ("contact_id") `);
        await queryRunner.query(`ALTER TABLE "auth_tokens" ADD CONSTRAINT "FK_9691367d446cd8b18f462c191b3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_contacts" ADD CONSTRAINT "FK_a81491e712124db8d5423803ecb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_contacts" ADD CONSTRAINT "FK_367bf9e66e36b0ee1680e8dfa6b" FOREIGN KEY ("contact_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_contacts" DROP CONSTRAINT "FK_367bf9e66e36b0ee1680e8dfa6b"`);
        await queryRunner.query(`ALTER TABLE "user_contacts" DROP CONSTRAINT "FK_a81491e712124db8d5423803ecb"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`);
        await queryRunner.query(`ALTER TABLE "auth_tokens" DROP CONSTRAINT "FK_9691367d446cd8b18f462c191b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_367bf9e66e36b0ee1680e8dfa6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a81491e712124db8d5423803ec"`);
        await queryRunner.query(`DROP TABLE "user_contacts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "auth_tokens"`);
    }

}
