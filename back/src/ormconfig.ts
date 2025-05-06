import * as path from 'node:path';

import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm'; /* import of connection to database*/

import getter from './configs/envConfiguration'; /* import configuration from ENV configuration*/
import { AuthTokenEntity } from './database/entities/auth-token.entity';
import { FileEntity } from './database/entities/file.entity';
import { MessageEntity } from './database/entities/message.entity';
import { UserEntity } from './database/entities/user.entity';

dotenv.config({
  // path: "./environments/local.env", //when back in system
  path: './environments/droplet.env', //when back in dicker
}); /* loads environment variables from a .env file into process.env */

// take out data from postgres ENV
const { user, password, host, port, dbName } = getter().postgres;
Logger.log('PAth----------------------------------------');
Logger.log(
  path.join(process.cwd(), 'dist', 'database', 'entities', '*.entity.js'),
);
// create connection to postgres database using script in package.json
export default new DataSource({
  type: 'postgres',
  host,
  port,
  username: user,
  password,
  database: dbName,
  entities: [UserEntity, AuthTokenEntity, FileEntity, MessageEntity],
  migrations: [
    path.join(process.cwd(), 'dist', 'database', 'migrations', '*.js'),
  ],
  synchronize:
    false /*Must be false to avoid automatic entity's synchronization with database */,
  logging: ['query', 'error'],
  logger: 'advanced-console', // option
});
