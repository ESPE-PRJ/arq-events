/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import { Logger } from '@nestjs/common';

let channel: Channel;
const logger = new Logger('RabbitMQ');

export async function connectRabbitMQ(
  onMessage: (routingKey: string, payload: any) => void,
): Promise<void> {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl) throw new Error('RABBITMQ_URL no definida');

    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();

    await channel.assertExchange('ordenes-exchange', 'topic', {
      durable: true,
    });

    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(
      queue.queue,
      'ordenes-exchange',
      'orden.lista-para-despacho',
    );

    await channel.consume(queue.queue, (msg) => {
      if (msg) {
        const content = msg.content.toString();
        const routingKey = msg.fields.routingKey;
        try {
          const payload = JSON.parse(content);
          onMessage(routingKey, payload);
          channel.ack(msg);
        } catch (err) {
          logger.error('❌ Error procesando mensaje:', err);
          channel.nack(msg);
        }
      }
    });

    logger.log(
      '✅ Conectado a RabbitMQ y escuchando "orden.lista-para-despacho"',
    );
  } catch (err) {
    logger.error('❌ Error al conectar con RabbitMQ:', err);
  }
}

export function publishEvent(routingKey: string, payload: unknown): void {
  if (!channel) {
    logger.error('❌ Canal no disponible');
    return;
  }
  const buffer = Buffer.from(JSON.stringify(payload));
  channel.publish('ordenes-exchange', routingKey, buffer);
  logger.log(`📤 Evento publicado: ${routingKey}`, payload);
}
