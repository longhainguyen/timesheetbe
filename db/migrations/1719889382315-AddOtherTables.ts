import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtherTables1719889382315 implements MigrationInterface {
    name = 'AddOtherTables1719889382315';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`client\` (\`id\` int NOT NULL AUTO_INCREMENT, \`clientName\` varchar(255) NOT NULL, \`contactInfo\` varchar(255) NOT NULL, \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('Common', 'Other') NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`timesheet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`workingTime\` int NOT NULL, \`status\` enum ('Pending', 'Approved', 'Rejected', 'NotSubmitted') NOT NULL, \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`projectId\` int NULL, \`userId\` int NULL, \`taskId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`project_task\` (\`projectId\` int NOT NULL, \`taskId\` int NOT NULL, INDEX \`IDX_a81f1f3ca71d469236a55e2bca\` (\`projectId\`), INDEX \`IDX_d9b0b32bfed516fd59d2c01d0e\` (\`taskId\`), PRIMARY KEY (\`projectId\`, \`taskId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_b88a18e4faeea3bce60d70a4ae3\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_cb5415b5e54f476329451212e9b\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`projectId\` \`projectId\` int NULL`);
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('staff', 'manager', 'admin') NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`branch\` \`branch\` enum ('Ha noi 1', 'Ha noi 2', 'Da nang') NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`client\` ADD CONSTRAINT \`FK_ad3b4bf8dd18a1d467c5c0fc13a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_b88a18e4faeea3bce60d70a4ae3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_cb5415b5e54f476329451212e9b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_ac58894ff3ba9e26707b7528ecd\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_689d5a0fd3a37c30aab320afd8e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_a147ecd5c870c35058f8437b425\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`project_task\` ADD CONSTRAINT \`FK_a81f1f3ca71d469236a55e2bcaa\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`project_task\` ADD CONSTRAINT \`FK_d9b0b32bfed516fd59d2c01d0e6\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_task\` DROP FOREIGN KEY \`FK_d9b0b32bfed516fd59d2c01d0e6\``);
        await queryRunner.query(`ALTER TABLE \`project_task\` DROP FOREIGN KEY \`FK_a81f1f3ca71d469236a55e2bcaa\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_a147ecd5c870c35058f8437b425\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_689d5a0fd3a37c30aab320afd8e\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_ac58894ff3ba9e26707b7528ecd\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_cb5415b5e54f476329451212e9b\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_b88a18e4faeea3bce60d70a4ae3\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP FOREIGN KEY \`FK_ad3b4bf8dd18a1d467c5c0fc13a\``);
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`branch\` \`branch\` enum ('Ha noi 1', 'Ha noi 2', 'Da nang') NULL DEFAULT 'NULL'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('staff', 'manager', 'admin') NULL DEFAULT 'NULL'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_project\` CHANGE \`projectId\` \`projectId\` int NULL DEFAULT 'NULL'`,
        );
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(
            `ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_cb5415b5e54f476329451212e9b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_b88a18e4faeea3bce60d70a4ae3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`DROP INDEX \`IDX_d9b0b32bfed516fd59d2c01d0e\` ON \`project_task\``);
        await queryRunner.query(`DROP INDEX \`IDX_a81f1f3ca71d469236a55e2bca\` ON \`project_task\``);
        await queryRunner.query(`DROP TABLE \`project_task\``);
        await queryRunner.query(`DROP TABLE \`timesheet\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP TABLE \`client\``);
    }
}
