/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ServerEnvironmentEnum } from 'config/server.config';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ServerHeaderInterceptor } from 'common/interceptor/header.interceptor';
import { DespachoService } from './despacho/despacho.service';
import { connectRabbitMQ } from './events/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const despachoService = app.get(DespachoService);

  await connectRabbitMQ((routingKey, payload) => {
    despachoService.handleOrdenEvent(routingKey, payload);
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const serverConfig = app.get(ConfigService);
  const logger = new Logger('ServerInfo');

  logger.log(
    `🚀 Despacho listo en el puerto ${serverConfig.get(ServerEnvironmentEnum.SERVER_PORT)}`,
  );

  app.useGlobalInterceptors(new ServerHeaderInterceptor());

  await app.listen(serverConfig.get(ServerEnvironmentEnum.SERVER_PORT) ?? 3000);
}

void bootstrap();
