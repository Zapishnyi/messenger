import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import environmentConfiguration from '../../configs/envConfiguration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        environmentConfiguration,
      ] /* add configuration to app Module import*/,
      isGlobal:
        true /* flag to have access to variable globally: will be visible in all modules of app*/,
    }),
  ],
  exports: [ConfigModule],
  providers: [],
})
export class EnvConnectionModule {}
