const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  positions: [
    {
      crypto_currency: {
        type: String,
        requires: true,
      },
      amount: {
        type: String,
        requires: true,
      },
      price_EUR: {
        type: Number,
      },
      price_USD: {
        type: Number,
      },
      price_GBP: {
        type: Number,
      },
      fiat_currency: {
        type: String,
      },
      date_of_purchase: {
        type: Date,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
