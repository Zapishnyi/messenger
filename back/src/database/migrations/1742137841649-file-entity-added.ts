import { MigrationInterface, QueryRunner } from "typeorm";

export class FileEntityAdded1742137841649 implements MigrationInterface {
    name = 'FileEntityAdded1742137841649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "filename" character varying NOT NULL, "filedata" bytea NOT NULL, "mimetype" character varying NOT NULL, "messageId" uuid, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_a78a68c3f577a485dd4c741909f" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_a78a68c3f577a485dd4c741909f"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
