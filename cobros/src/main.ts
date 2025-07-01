/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ServerEnvironmentEnum } from 'config/server.config';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ServerHeaderInterceptor } from 'common/interceptor/header.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { connectRabbitMQ } from './events/rabbitmq.service';
import { CobroService } from './cobro/cobro.service';
import { CobroEnum } from './enums/cobro.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const cobroService = app.get(CobroService);

  await connectRabbitMQ(async (routingKey, payload) => {
    if (routingKey === 'orden.creada') {
      console.log('📩 Evento recibido: orden.creada', payload);

      try {
        await cobroService.create({
          orden_id: payload.ordenId,
          estado: CobroEnum.PENDIENTE,
          metodo_pago: 'por_definir',
        });
        console.log('✅ Cobro generado para orden:', payload.ordenId);
      } catch (err) {
        console.error('❌ Error al crear cobro desde evento:', err);
      }
    }
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const serverConfig = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Arquitectura Events')
    .setDescription('The ARQ Events API description')
    .setVersion('1.0')
    .addTag('arq')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const logger = new Logger('ServerInfo');
  logger.log(
    `✅ Cobros corriendo | Server: ${serverConfig.get(ServerEnvironmentEnum.SERVER_NAME)} | Port: ${serverConfig.get(ServerEnvironmentEnum.SERVER_PORT)}`,
  );

  app.useGlobalInterceptors(new ServerHeaderInterceptor());

  await app.listen(serverConfig.get(ServerEnvironmentEnum.SERVER_PORT) ?? 3000);
}

void bootstrap();
