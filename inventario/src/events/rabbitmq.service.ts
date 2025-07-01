/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import * as dotenv from 'dotenv';

dotenv.config();

let channel: Channel; // ✅ canal global

export async function connectRabbitMQ(
  onMessage: (routingKey: string, payload: any) => void,
): Promise<void> {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl) throw new Error('RABBITMQ_URL no definida en .env');

    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();

    await channel.assertExchange('ordenes-exchange', 'topic', {
      durable: true,
    });

    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(
      queue.queue,
      'ordenes-exchange',
      'orden.confirmada',
    );

    await channel.consume(queue.queue, (message) => {
      if (message) {
        const content = message.content.toString();
        const routingKey = message.fields.routingKey;
        try {
          const payload = JSON.parse(content);
          onMessage(routingKey, payload);
          channel.ack(message);
        } catch (err) {
          console.error('[RabbitMQ] ❌ Error procesando mensaje:', err);
          channel.nack(message);
        }
      }
    });

    console.log(
      '[RabbitMQ] ✅ Conectado y escuchando eventos de orden.confirmada',
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('[RabbitMQ] ❌ Error al conectar:', err.message);
    } else {
      console.error('[RabbitMQ] ❌ Error desconocido');
    }
  }
}

// ✅ Función exportada correctamente, usando el canal global
export function publishEvent(routingKey: string, payload: unknown): void {
  if (!channel) {
    console.error('[RabbitMQ] ❌ Canal no disponible para publicar');
    return;
  }

  const buffer = Buffer.from(JSON.stringify(payload));
  channel.publish('ordenes-exchange', routingKey, buffer);
  console.log(`[RabbitMQ] 📤 Evento publicado: ${routingKey}`, payload);
}
