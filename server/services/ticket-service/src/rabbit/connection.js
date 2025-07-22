
import amqp from 'amqplib';

let connection;
let channel;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection error:', err);
  }
};

export const getChannel = () => channel;
