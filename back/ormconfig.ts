import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm'; /* import of connection to database*/

import getter from './src/configs/envConfiguration'; /* import configuration from ENV configuration*/

dotenv.config({
  // path: "./environments/local.env", //when back in system
  path: './environments/docker.env', //when back in dicker
}); /* loads environment variables from a .env file into process.env */

// take out data from postgres ENV
const { user, password, host, port, dbName } = getter().postgres;

// create connection to postgres database using script in package.json
export default new DataSource({
  type: 'postgres',
  host,
  port,
  username: user,
  password,
  database: dbName,
  entities: [
    path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize:
    false /*Must be false to avoid automatic entity's synchronization with database */,
});
