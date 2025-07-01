import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ServerEnvironmentEnum } from 'config/server.config';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ServerHeaderInterceptor } from 'common/interceptor/header.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { connectRabbitMQ } from './events/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  try {
    await connectRabbitMQ();
    logger.log('[RabbitMQ] Conexión con el broker establecida correctamente.');
  } catch (error) {
    logger.error('[RabbitMQ] Error al conectar con el broker:', error);
  }

  app.enableCors();

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

  logger.log(
    `[Server] ${serverConfig.get(ServerEnvironmentEnum.SERVER_NAME)} | Header: ${serverConfig.get(ServerEnvironmentEnum.SERVER_HEADER)} | Version: ${serverConfig.get(ServerEnvironmentEnum.SERVER_VERSION)} | Port: ${serverConfig.get(ServerEnvironmentEnum.SERVER_PORT)}`,
  );

  app.useGlobalInterceptors(new ServerHeaderInterceptor());

  await app.listen(serverConfig.get(ServerEnvironmentEnum.SERVER_PORT) ?? 3000);
}
void bootstrap();
