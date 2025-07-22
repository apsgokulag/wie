import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import ticketRoutes from './routes/ticket.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectRabbitMQ } from './rabbit/connection.js';
import { startConsumers } from './rabbit/index.js';
// 👇 Needed for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Config
dotenv.config();
const app = express();
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/tickets', ticketRoutes);
// Start server and services
const PORT = process.env.PORT || 5003;
const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    await startConsumers();
    app.listen(PORT, () => {
      console.log(`Ticket service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};
startServer();