import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConfigService {
    constructor(private configService: ConfigService) {}

    getDataSourceOptions(): DataSourceOptions {
        return {
            type: 'mysql',
            host: this.configService.get('database.host'),
            port: this.configService.get('database.port'),
            username: this.configService.get('database.username'),
            password: this.configService.get('database.password'),
            database: this.configService.get('database.name'),
            entities: ['dist/**/*.entity.js'],
            migrations: ['dist/db/migrations/*.js'],
        };
    }
}

const dataSourceFactory = async (configService: ConfigService): Promise<DataSource> => {
    const databaseConfigService = new DatabaseConfigService(configService);
    const options = databaseConfigService.getDataSourceOptions();
    return new DataSource(options);
};

export default dataSourceFactory;
