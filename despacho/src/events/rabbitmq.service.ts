/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';
import process from 'process';

const logger = new Logger('RabbitMQ');
let channel: amqp.Channel;

export async function connectRabbitMQ(
  onMessage: (routingKey: string, payload: any) => void,
): Promise<void> {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || '');
    channel = await connection.createChannel();

    await channel.assertExchange('ordenes-exchange', 'topic', {
      durable: true,
    });

    const queue = await channel.assertQueue('', { exclusive: true });

    await channel.bindQueue(queue.queue, 'ordenes-exchange', 'orden.pagada');
    await channel.bindQueue(
      queue.queue,
      'ordenes-exchange',
      'orden.stock-descontado',
    );

    await channel.consume(queue.queue, (message) => {
      if (message) {
        const content = message.content.toString();
        const routingKey = message.fields.routingKey;
        try {
          const payload = JSON.parse(content);
          onMessage(routingKey, payload);
          channel.ack(message);
        } catch (error) {
          logger.error('❌ Error procesando mensaje RabbitMQ', error);
          channel.nack(message);
        }
      }
    });

    logger.log('✅ Escuchando eventos orden.pagada y orden.stock-descontado');
  } catch (error) {
    logger.error('❌ Error al conectar con RabbitMQ:', error);
  }
}

export function publishEvent(routingKey: string, payload: any): void {
  if (!channel) {
    logger.error('❌ Canal de RabbitMQ no inicializado');
    return;
  }

  const buffer = Buffer.from(JSON.stringify(payload));
  channel.publish('ordenes-exchange', routingKey, buffer);
  logger.log(`📤 Evento publicado: ${routingKey}`, payload);
}
