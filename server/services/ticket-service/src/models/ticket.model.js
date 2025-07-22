import mongoose from 'mongoose';
const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreateGroup', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    location: { type: String, required: false },
    ticketType: {
      type: String,
      enum: ['general', 'vip', 'vvip'],
      default: 'general'
    },
    price: { type: Number, required: false },
    image: { type: String, required: false }
  },
  {
    timestamps: true
  }
);
const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
