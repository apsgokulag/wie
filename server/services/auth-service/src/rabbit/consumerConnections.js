
import User from '../models/user.model.js';
import { listenQueue } from './consumer.js';

export const listenForUserRequests = async () => {
  await listenQueue('get-user', async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
  });
};
