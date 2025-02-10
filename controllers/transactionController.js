import Transaction from "../models/transactionModel.js";

// Process payment
export const processPayment = async (req, res) => {
  const { prescriptionId, amount } = req.body;

  try {
    const transaction = await Transaction.create({
      prescriptionId,
      amount,
      paymentStatus: "Completed",
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error processing payment" });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("prescriptionId");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};
