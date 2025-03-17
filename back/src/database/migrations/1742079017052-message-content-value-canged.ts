import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageContentValueCanged1742079017052 implements MigrationInterface {
    name = 'MessageContentValueCanged1742079017052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME COLUMN "message" TO "content"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME COLUMN "content" TO "message"`);
    }

}
