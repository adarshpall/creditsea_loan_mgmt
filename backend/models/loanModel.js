const mongoose = require('mongoose');

// Mongoose Schema
const loanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  applicant: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  processedAt: { type: Date }
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

// 🔍 Validate required fields and types
function validateLoan(loan) {
  if (!loan.id || !loan.applicant || !loan.amount || !loan.timestamp) {
    return 'Missing required loan fields';
  }
  if (typeof loan.amount !== 'number' || loan.amount <= 0) {
    return 'Invalid loan amount';
  }
  return null;
}

// ✨ Enrich loan before saving
function enrichLoan(loan) {
  return {
    ...loan,
    status: 'pending',
    processedAt: new Date()
  };
}

// Export everything
module.exports = {
  Loan,
  validateLoan,
  enrichLoan
};
