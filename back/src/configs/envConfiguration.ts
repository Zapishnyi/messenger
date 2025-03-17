import * as process from 'node:process';

import { IsolationLevelsEnum } from '../modules/transaction-isolation-level/enums/isolationLevels.enum';
import { EnvConfigType } from './envConfigType';

const validate = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export default (): EnvConfigType => ({
  app: {
    port: Number(validate('APP_PORT')),
    host: validate('APP_HOST'),
    ws_port: Number(validate('WS_PORT')),
    cors_port: Number(validate('CORS_PORT')),
  },
  jwt: {
    accessSecret: validate('JWT_ACCESS_SECRET'),
    accessExpire: Number(validate('JWT_ACCESS_EXPIRE')),
    refreshSecret: validate('JWT_REFRESH_SECRET'),
    refreshExpire: Number(validate('JWT_REFRESH_EXPIRE')),
  },
  postgres: {
    port: Number(validate('POSTGRES_PORT')),
    host: validate('POSTGRES_HOST'),
    user: validate('POSTGRES_USER'),
    password: validate('POSTGRES_PASSWORD'),
    dbName: validate('POSTGRES_DB'),
    transactionIsolationLevel: validate(
      'POSTGRES_TRANSACTION_ISOLATION_LEVEL',
    ) as IsolationLevelsEnum,
  },
});
