import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTaskTableAgain1719906758253 implements MigrationInterface {
    name = 'CreateProjectTaskTableAgain1719906758253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`projects_task\` (\`taskId\` int NOT NULL, \`projectId\` int NOT NULL, INDEX \`IDX_02040fb897d4365a67814d2e39\` (\`taskId\`), INDEX \`IDX_e66bd93bae93b6bbe556f9dc83\` (\`projectId\`), PRIMARY KEY (\`taskId\`, \`projectId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`client\` DROP FOREIGN KEY \`FK_ad3b4bf8dd18a1d467c5c0fc13a\``);
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_b88a18e4faeea3bce60d70a4ae3\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_cb5415b5e54f476329451212e9b\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`projectId\` \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_ac58894ff3ba9e26707b7528ecd\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_689d5a0fd3a37c30aab320afd8e\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_a147ecd5c870c35058f8437b425\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`projectId\` \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`taskId\` \`taskId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('staff', 'manager', 'admin') NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`branch\` \`branch\` enum ('Ha noi 1', 'Ha noi 2', 'Da nang') NULL`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD CONSTRAINT \`FK_ad3b4bf8dd18a1d467c5c0fc13a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_b88a18e4faeea3bce60d70a4ae3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_cb5415b5e54f476329451212e9b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_ac58894ff3ba9e26707b7528ecd\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_689d5a0fd3a37c30aab320afd8e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_a147ecd5c870c35058f8437b425\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects_task\` ADD CONSTRAINT \`FK_02040fb897d4365a67814d2e394\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`projects_task\` ADD CONSTRAINT \`FK_e66bd93bae93b6bbe556f9dc83a\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects_task\` DROP FOREIGN KEY \`FK_e66bd93bae93b6bbe556f9dc83a\``);
        await queryRunner.query(`ALTER TABLE \`projects_task\` DROP FOREIGN KEY \`FK_02040fb897d4365a67814d2e394\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_a147ecd5c870c35058f8437b425\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_689d5a0fd3a37c30aab320afd8e\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_ac58894ff3ba9e26707b7528ecd\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_cb5415b5e54f476329451212e9b\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_b88a18e4faeea3bce60d70a4ae3\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP FOREIGN KEY \`FK_ad3b4bf8dd18a1d467c5c0fc13a\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`branch\` \`branch\` enum ('Ha noi 1', 'Ha noi 2', 'Da nang') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('staff', 'manager', 'admin') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`taskId\` \`taskId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`projectId\` \`projectId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_a147ecd5c870c35058f8437b425\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_689d5a0fd3a37c30aab320afd8e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_ac58894ff3ba9e26707b7528ecd\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`projectId\` \`projectId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_project\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_cb5415b5e54f476329451212e9b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_b88a18e4faeea3bce60d70a4ae3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD CONSTRAINT \`FK_ad3b4bf8dd18a1d467c5c0fc13a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX \`IDX_e66bd93bae93b6bbe556f9dc83\` ON \`projects_task\``);
        await queryRunner.query(`DROP INDEX \`IDX_02040fb897d4365a67814d2e39\` ON \`projects_task\``);
        await queryRunner.query(`DROP TABLE \`projects_task\``);
    }

}
