import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import * as dotenv from 'dotenv';

dotenv.config();

let channel: Channel;

export async function connectRabbitMQ(): Promise<void> {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl) throw new Error('RABBITMQ_URL no definida en .env');

    const connection = await amqp.connect(rabbitUrl);
    const ch: Channel = await connection.createChannel();
    await ch.assertExchange('ordenes-exchange', 'topic', { durable: true });

    channel = ch;
    console.log('[RabbitMQ] Conectado y exchange listo en ordenes');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('[RabbitMQ] Error al conectar:', err.message);
    } else {
      console.error('[RabbitMQ] Error desconocido');
    }
  }
}

export function publishEvent(routingKey: string, payload: unknown): void {
  if (!channel) {
    console.error('[RabbitMQ] Canal no disponible para publicar');
    return;
  }

  const buffer = Buffer.from(JSON.stringify(payload));
  channel.publish('ordenes-exchange', routingKey, buffer);
  console.log(`[RabbitMQ] Evento publicado: ${routingKey}`, payload);
}
