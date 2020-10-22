const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["airtime", "data_bundle", "transfer_fund", "cable", "electricity", "recharge_card"],
  },
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: [
      "ORDER_RECEIVED",
      "ORDER_PROCESSED",
      "ORDER_COMPLETED",
      "ORDER_ERROR",
      "ORDER_ONHOLD",
      "ORDER_CANCELLED",
    ],
  },
  trx_detail: Object,
  orderType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountCharged: {
    type: Number,
    required: true,
  },
  walletBalance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
