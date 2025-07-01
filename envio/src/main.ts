/* eslint-disable @typescript-eslint/no-misused-promises */
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectRabbitMQ } from './events/rabbitmq.service';
import { EnvioService } from './envio/envio.service';
import { ConfigService } from '@nestjs/config';
import { ServerEnvironmentEnum } from 'config/server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const logger = new Logger('EnvioMain');
  const envioService = app.get(EnvioService);

  const serverConfig = app.get(ConfigService);

  await connectRabbitMQ(async (routingKey: string, payload: any) => {
    await envioService.handleEventoOrdenLista(routingKey, payload);
  });

  await app.listen(serverConfig.get(ServerEnvironmentEnum.SERVER_PORT) ?? 3000);
  logger.log(
    `🚀 Microservicio de Envío escuchando en el puerto ${ServerEnvironmentEnum.SERVER_PORT}`,
  );
}
void bootstrap();
