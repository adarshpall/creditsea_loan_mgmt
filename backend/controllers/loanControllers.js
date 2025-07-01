const { Loan, validateLoan, enrichLoan } = require('../models/loanModel');
const { metrics, addError, sendMetricsNow } = require('../utils/metrics');
const processedLoanIds = new Set();

const handleLoanMessage = async (loans, ws) => {
  if (!Array.isArray(loans)) throw new Error("Expected array");

  metrics.received += loans.length;
  const validLoans = [];

  for (const loan of loans) {
    if (processedLoanIds.has(loan.id)) continue;

    const error = validateLoan(loan);
    if (error) {
      metrics.errors++;
      addError({ loan, error });
      continue;
    }

    processedLoanIds.add(loan.id);
    const enriched = enrichLoan(loan);
    validLoans.push(enriched);
    metrics.processed++;

    try {
      await Loan.create(enriched);
    } catch (err) {
      console.error('DB Save Error:', err.message);
    }
  }

  if (validLoans.length) {
    ws.send(JSON.stringify({ type: 'processed', payload: validLoans }));
  }
};

const createLoan = async (req, res) => {
  const loan = req.body;
  const error = validateLoan(loan);

  if (error) {
    metrics.errors++;
    addError({ loan, error });
    sendMetricsNow(global.wss);
    return res.status(400).json({ error });
  }

  const enriched = enrichLoan(loan);

  try {
    const savedLoan = await Loan.create(enriched);
    metrics.received++;
    metrics.processed++;
    sendMetricsNow(global.wss); // ✅ WebSocket Broadcast here
    res.status(201).json(savedLoan);
  } catch (err) {
    metrics.errors++;
    addError({ loan, error: err.message });
    sendMetricsNow(global.wss);
    res.status(500).json({ error: err.message });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};

module.exports = { handleLoanMessage, createLoan, getAllLoans };
