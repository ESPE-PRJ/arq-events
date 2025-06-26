import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import serverConfig from 'config/server.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'config/database.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRootAsync(
      databaseConfig.asProvider() as Partial<PostgresConnectionOptions>,
    ),
    ConfigModule.forRoot({
      load: [serverConfig],
      isGlobal: true,
      cache: true,
    }),
    ClienteModule,
  ],
})
export class AppModule {}
