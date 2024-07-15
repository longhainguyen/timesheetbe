import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToUser1720430578388 implements MigrationInterface {
    name = 'AddImageToUser1720430578388';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `  CREATE TABLE \`user_image\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`path\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB;`,
        );
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`userImageId\` int NULL`);
        await queryRunner.query(
            `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_2011c646401c43cf2f7c1f9af4\` (\`userImageId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_2011c646401c43cf2f7c1f9af4c\` FOREIGN KEY (\`userImageId\`) REFERENCES \`user_image\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_2011c646401c43cf2f7c1f9af4c\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_2011c646401c43cf2f7c1f9af4\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userImageId\``);
        await queryRunner.query(`DROP TABLE \`user_image\``);
    }
}
