// shared/utils/rpc.js
import { getChannel } from './connection.js';
import { v4 as uuidv4 } from 'uuid';

export const sendRPC = async (queue, payload) => {
  const channel = getChannel();

  const correlationId = uuidv4();
  const replyQueue = await channel.assertQueue('', { exclusive: true });

  return new Promise((resolve, reject) => {
    channel.consume(
      replyQueue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const response = JSON.parse(msg.content.toString());
          resolve(response);
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      correlationId,
      replyTo: replyQueue.queue,
    });

    // Optional: Add timeout for safety
    setTimeout(() => {
      reject(new Error('Timeout: No response from RabbitMQ'));
    }, 5000);
  });
};
