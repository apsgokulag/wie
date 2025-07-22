import { listenForUserRequests } from './consumerConnections.js';
export const startConsumers = async () => {
  try {
    await listenForUserRequests();
    console.log('✅ Consumers started.');
  } catch (err) {
    console.error('❌ Error starting consumers:', err);
    throw err;
  }
};
