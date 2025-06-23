/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseSourceOptions } from './database.config';

const Config: DataSourceOptions = databaseSourceOptions as DataSourceOptions;

export const AppDataSource: DataSource = new DataSource(Config);
