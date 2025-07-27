const db = require('../db/db');

exports.getAllCredits = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.id, cu.name AS customer, t.amount, t.description, c.credit_status, c.date_created, c.date_paid
      FROM credit c
      JOIN customer cu ON c.customer_id = cu.id
      JOIN transactions t ON c.txn_id = t.id
      ORDER BY c.date_created DESC
    `).all();

    res.json({ credits: rows });
  } catch (err) {
    console.error("❌ Error fetching credits:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getUnpaidCredits = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.id, cu.name AS customer, t.amount, t.description, c.date_created
      FROM credit c
      JOIN customer cu ON c.customer_id = cu.id
      JOIN transactions t ON c.txn_id = t.id
      WHERE c.credit_status = 'ongoing'
      ORDER BY c.date_created ASC
    `).all();

    res.json({ unpaid: rows });
  } catch (err) {
    console.error("❌ Error fetching unpaid credits:", err.message);
    res.status(500).json({ error: err.message });
  }
};
