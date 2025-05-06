import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvConfigType, PostgresConfigType } from '../../configs/envConfigType';

@Module({
  imports: [
    // Module imported from @nestjs/typeorm to create configuration of connection to database (Postgres in our case)
    TypeOrmModule.forRootAsync({
      // The useFactory key is part of the forRootAsync or similar methods in NestJS modules.
      // It specifies a factory function that is used to create the configuration object.
      // This factory function can be asynchronous (as indicated by the async keyword).

      useFactory: async (envConfig: ConfigService<EnvConfigType>) => {
        const postgresConfig = envConfig.get<PostgresConfigType>('postgres');
        if (!postgresConfig) {
          throw new Error('Postgres configuration not found');
        }
        const {
          user: username,
          password,
          host,
          port,
          dbName: database,
        } = postgresConfig;

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [
            path.join(
              process.cwd(),
              'dist',
              'database',
              'entities',
              '*.entity.js',
            ),
          ],
          migrationsRun:
            true /* automatically check and start migrations if there is any  */,
          migrations: [
            path.join(process.cwd(), 'dist', 'database', 'migrations', '*.js'),
          ],
          synchronize:
            false /*Must be false to avoid automatic entity's synchronisation with database */,
        };
      },
      // allow to inject ConfigService from '@nestjs/config' and push ENV configuration
      // in useFactory function as argument above
      inject: [ConfigService],
    }),
  ],
  providers: [],
  // Alternative way to connect ENV configuration through external service
  // providers: [RedisService],
})
export class PostgresModule {}
