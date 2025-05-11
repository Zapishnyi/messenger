import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfigType } from './configs/envConfigType';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/app/ssl/tls.key'),
  //   cert: fs.readFileSync('/app/ssl/tls.crt'),
  // };
  const app = await NestFactory.create(
    AppModule,
    //  {httpsOptions} for ssl if needed
  );
  const appEnvConfig = app.get(ConfigService).get<AppConfigType>('app');
  app.enableCors({
    origin: appEnvConfig?.cors_origin, // Allowed origin for CORS
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
  const SwaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, SwaggerDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      docExpansion: 'list',
      defaultModelExpandDepth: 1,
      persistAuthorization: true,
    },
  });

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new IoAdapter(app));
  // Start HTTP server
  await app.listen(appEnvConfig?.port || 5000, async () => {
    Logger.log(
      `HTTPS server started on: https://${appEnvConfig?.host}:${appEnvConfig?.port}`,
    );
    Logger.log(
      `Websocket server started on: https://${appEnvConfig?.host}:${appEnvConfig?.port}`,
    );
    Logger.log(
      `Swagger is available on: https://${appEnvConfig?.host}:${appEnvConfig?.port}/api-docs`,
    );
  });
}
void bootstrap();
