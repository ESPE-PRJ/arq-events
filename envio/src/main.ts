/* eslint-disable @typescript-eslint/no-misused-promises */
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectRabbitMQ } from './events/rabbitmq.service';
import { EnvioService } from './envio/envio.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const logger = new Logger('EnvioMain');
  const envioService = app.get(EnvioService);

  await connectRabbitMQ(async (routingKey: string, payload: any) => {
    await envioService.handleEventoOrdenLista(routingKey, payload);
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Microservicio de Envío escuchando en el puerto ${port}`);
}
void bootstrap();
