import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Read secrets from files and set environment variables
const secrets = {
    SECRET_KEY: '/run/secrets/secret_key',
    DATABASE_PASSWORD: '/run/secrets/db_password',
    CLOUDINARY_API_SECRET: '/run/secrets/cloud_api_secret',
    MAILDEV_INCOMING_PASS: '/run/secrets/mail_pass',
};

for (const [key, path] of Object.entries(secrets)) {
    try {
        const value = fs.readFileSync(path, 'utf8').trim();
        process.env[key] = value;
    } catch (error) {
        console.error(`Error reading secret ${key} from ${path}`, error);
    }
}

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: configService.getOrThrow('DATABASE_HOST'),
    port: configService.getOrThrow('DATABASE_PORT'),
    username: configService.getOrThrow('DATABASE_USER'),
    password: configService.getOrThrow('DATABASE_PASSWORD'),
    database: configService.getOrThrow('DATABASE_NAME'),
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
