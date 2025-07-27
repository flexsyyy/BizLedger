const db = require('../db/db');

exports.getLedger = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        t.id,
        t.date,
        t.time,
        t.description,
        t.transaction_type,
        t.amount,
        c.name AS customer_name
      FROM transactions t
      LEFT JOIN customer c ON t.customer_id = c.id
      ORDER BY datetime(t.date || 'T' || t.time) DESC
    `).all();

    const formatted = rows.map((txn, idx) => ({
      id: txn.id,
      s_no: idx + 1,
      date: txn.date,
      time: txn.time,
      description: txn.description,
      transaction_type: txn.transaction_type,
      amount: txn.amount,
      customer_name: txn.customer_name || 'Unknown',
      // Keep the old format for backward compatibility with existing frontend code
      credit: txn.transaction_type === 'credit' ? `${txn.amount}/-` : '-',
      debit: txn.transaction_type === 'debit' ? `${txn.amount}/-` : '-'
    }));

    res.json({ ledger: formatted });
  } catch (err) {
    console.error("❌ Error fetching ledger:", err.message);
    res.status(500).json({ error: err.message });
  }
};
