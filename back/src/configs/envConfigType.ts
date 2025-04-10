import { IsolationLevelsEnum } from '../modules/transaction-isolation-level/enums/isolationLevels.enum';

export type EnvConfigType = {
  app: AppConfigType;
  jwt: JWTConfigType;
  postgres: PostgresConfigType;
};

export type AppConfigType = {
  port: number;
  host: string;
  cors_origin: string;
  cors_port: number;
};

export type PostgresConfigType = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
  transactionIsolationLevel: IsolationLevelsEnum;
};

export type JWTConfigType = {
  accessSecret: string;
  accessExpire: number;
  refreshSecret: string;
  refreshExpire: number;
};
