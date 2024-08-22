// models/Cart.js
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      clothes: { type: mongoose.Schema.Types.ObjectId, ref: 'Clothes', required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    }
  ],
  totalAmount: { type: Number, required: true }
});

module.exports = mongoose.model('Cart', CartSchema);
