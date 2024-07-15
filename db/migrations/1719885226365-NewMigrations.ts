import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1719885226365 implements MigrationInterface {
    name = 'NewMigrations1719885226365';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user_project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`projectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('staff', 'manager', 'admin') NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`branch\` \`branch\` enum ('Ha noi 1', 'Ha noi 2', 'Da nang') NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_b88a18e4faeea3bce60d70a4ae3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_cb5415b5e54f476329451212e9b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_cb5415b5e54f476329451212e9b\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_b88a18e4faeea3bce60d70a4ae3\``);
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`branch\` \`branch\` enum ('Ha noi 1', 'Ha noi 2', 'Da nang') NULL DEFAULT 'NULL'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('staff', 'manager', 'admin') NULL DEFAULT 'NULL'`,
        );
        await queryRunner.query(`DROP TABLE \`user_project\``);
    }
}
