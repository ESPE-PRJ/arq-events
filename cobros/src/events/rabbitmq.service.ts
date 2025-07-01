/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/events/rabbitmq.service.ts
import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import * as dotenv from 'dotenv';

dotenv.config();

let channel: Channel;

export async function connectRabbitMQ(
  onMessageCallback?: (routingKey: string, payload: any) => void,
): Promise<void> {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl) throw new Error('RABBITMQ_URL no definida en .env');

    const connection = await amqp.connect(rabbitUrl);
    const ch: Channel = await connection.createChannel();
    await ch.assertExchange('ordenes-exchange', 'topic', { durable: true });

    if (onMessageCallback) {
      const { queue } = await ch.assertQueue('', { exclusive: true });
      await ch.bindQueue(queue, 'ordenes-exchange', 'orden.creada');

      ch.consume(
        queue,
        (msg) => {
          if (msg?.content) {
            const payload = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            onMessageCallback(routingKey, payload);
          }
        },
        { noAck: true },
      );
    }

    channel = ch;
    console.log('[RabbitMQ] ✅ Conectado y exchange listo en Cobros');
  } catch (err: any) {
    console.error('[RabbitMQ] ❌ Error al conectar:', err.message || err);
  }
}

export function publishEvent(routingKey: string, payload: unknown): void {
  if (!channel) {
    console.error('[RabbitMQ] ❌ Canal no disponible para publicar');
    return;
  }

  const buffer = Buffer.from(JSON.stringify(payload));
  channel.publish('ordenes-exchange', routingKey, buffer);
  console.log(`[RabbitMQ] 📤 Evento publicado: ${routingKey}`, payload);
}
