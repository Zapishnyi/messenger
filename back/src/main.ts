import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfigType } from './configs/envConfigType';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  const appEnvConfig = httpApp.get(ConfigService).get<AppConfigType>('app');
  httpApp.enableCors({
    origin: `http://${appEnvConfig?.host}:${appEnvConfig?.cors_port}`,
    credentials: true, // If cookies or auth headers are needed
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Messenger API')
    .setDescription('API for message exchange between registered users')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'headers' },
      'Access-Token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'headers' },
      'Refresh-Token',
    )
    .build();

  // Creation of Swagger document
  const SwaggerDocument = SwaggerModule.createDocument(httpApp, swaggerConfig);
  SwaggerModule.setup('api-docs', httpApp, SwaggerDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      docExpansion: 'list',
      defaultModelExpandDepth: 1,
      persistAuthorization: true,
    },
  });

  // Pipes
  httpApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Start HTTP server
  await httpApp.listen(appEnvConfig?.port || 3000, async () => {
    Logger.log(
      `HTTP server started on: http://${appEnvConfig?.host}:${appEnvConfig?.port}`,
    );
    Logger.log(
      `Swagger is available on: http://${appEnvConfig?.host}:${appEnvConfig?.port}/api-docs`,
    );
  });

  // WS server initialization
  const wsApp = await NestFactory.create(AppModule);
  wsApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  wsApp.useWebSocketAdapter(new IoAdapter(wsApp));

  // Start WS server

  await wsApp.listen(appEnvConfig?.ws_port || 3001, () => {
    Logger.log(
      `WebSocket server started on: http://${appEnvConfig?.host}:${appEnvConfig?.ws_port}`,
    );
  });
}
void bootstrap();
