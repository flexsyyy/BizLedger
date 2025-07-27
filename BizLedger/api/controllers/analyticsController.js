const db = require('../db/db');

exports.customerBalances = (req, res) => {
  try {
    const customers = db.prepare(`SELECT id, name FROM customer`).all();
    const result = [];

    customers.forEach(customer => {
      const debit = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM transactions
        WHERE customer_id = ? AND transaction_type = 'debit'
      `).get(customer.id).total;

      const creditCash = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM transactions
        WHERE customer_id = ? AND transaction_type = 'credit' AND on_credit = 0
      `).get(customer.id).total;

      const creditRepayments = db.prepare(`
        SELECT COUNT(*) AS paid
        FROM credit
        WHERE customer_id = ? AND credit_status = 'paid'
      `).get(customer.id).paid;

      const creditAverage = db.prepare(`
        SELECT AVG(t.amount) AS avg_amt
        FROM credit c
        JOIN transactions t ON t.id = c.txn_id
        WHERE c.customer_id = ? AND c.credit_status = 'paid'
      `).get(customer.id).avg_amt || 0;

      const repaymentAmount = creditRepayments * creditAverage;

      const balance = debit - creditCash - repaymentAmount;

      result.push({
        name: customer.name,
        balance: parseFloat(balance.toFixed(2))
      });
    });

    res.json({ customer_balances: result });
  } catch (err) {
    console.error("❌ Error fetching customer balances:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.totalIncome = (req, res) => {
  try {
    const period = req.query.period || 'month';
    let whereClause = "WHERE transaction_type = 'credit' AND on_credit = 0";

    switch (period) {
      case 'day':
        whereClause += " AND date >= date('now', '-1 day')";
        break;
      case 'week':
        whereClause += " AND date >= date('now', '-7 days')";
        break;
      case 'month':
        whereClause += " AND date >= date('now', '-1 month')";
        break;
      case 'year':
        whereClause += " AND date >= date('now', '-1 year')";
        break;
    }

    const result = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total_income
      FROM transactions
      ${whereClause}
    `).get();
    res.json(result);
  } catch (err) {
    console.error("❌ Error calculating total income:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.totalExpense = (req, res) => {
  try {
    const period = req.query.period || 'month';
    let whereClause = "WHERE transaction_type = 'debit'";

    switch (period) {
      case 'day':
        whereClause += " AND date >= date('now', '-1 day')";
        break;
      case 'week':
        whereClause += " AND date >= date('now', '-7 days')";
        break;
      case 'month':
        whereClause += " AND date >= date('now', '-1 month')";
        break;
      case 'year':
        whereClause += " AND date >= date('now', '-1 year')";
        break;
    }

    const result = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total_expense
      FROM transactions
      ${whereClause}
    `).get();
    res.json(result);
  } catch (err) {
    console.error("❌ Error calculating total expense:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.topSpendingCategories = (req, res) => {
  try {
    const period = req.query.period || 'month';
    const type = req.query.type || 'debit'; // debit for spending, credit for income

    let whereClause = `WHERE t.transaction_type = '${type}'`;

    switch (period) {
      case 'day':
        whereClause += " AND t.date >= '2025-05-31'";
        break;
      case 'week':
        whereClause += " AND t.date >= '2025-05-25'";
        break;
      case 'month':
        whereClause += " AND t.date >= '2025-05-01'";
        break;
      case 'year':
        whereClause += " AND t.date >= '2025-01-01'";
        break;
    }

    const result = db.prepare(`
      SELECT cat.name AS category, SUM(t.amount) AS total_spent
      FROM transactions t
      JOIN category cat ON cat.id = t.category_id
      ${whereClause}
      GROUP BY cat.id
      ORDER BY total_spent DESC
      LIMIT 5
    `).all();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching top categories:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.monthlySummary = (req, res) => {
  try {
    const period = req.query.period || 'month';
    console.log(`📊 Monthly summary requested for period: ${period}`);
    let query;

    switch (period) {
      case 'day':
        query = `
          SELECT date AS period,
                 SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_income,
                 SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_expense
          FROM transactions
          WHERE date >= date('now', '-7 days')
          GROUP BY date
          ORDER BY date DESC
        `;
        break;
      case 'week':
        query = `
          SELECT date AS period,
                 SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_income,
                 SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_expense
          FROM transactions
          WHERE date >= '2025-05-25'
          GROUP BY date
          ORDER BY date DESC
        `;
        break;
      case 'year':
        query = `
          SELECT substr(date, 1, 4) AS period,
                 SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_income,
                 SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_expense
          FROM transactions
          GROUP BY substr(date, 1, 4)
          ORDER BY period DESC
          LIMIT 5
        `;
        break;
      default: // month
        query = `
          SELECT substr(date, 1, 7) AS period,
                 SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_income,
                 SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_expense
          FROM transactions
          GROUP BY substr(date, 1, 7)
          ORDER BY period DESC
          LIMIT 6
        `;
    }

    const result = db.prepare(query).all();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching summary:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.categoryTrends = (req, res) => {
  try {
    const result = db.prepare(`
      SELECT substr(t.date, 1, 7) AS month, c.name AS category,
             SUM(t.amount) AS total
      FROM transactions t
      JOIN category c ON c.id = t.category_id
      GROUP BY month, c.name
      ORDER BY month DESC
      LIMIT 50
    `).all();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching category trends:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.frequentItems = (req, res) => {
  try {
    const result = db.prepare(`
      SELECT i.name AS item, COUNT(t.id) AS times_bought
      FROM transactions t
      JOIN items i ON i.id = t.item_id
      WHERE t.transaction_type = 'debit'
      GROUP BY t.item_id
      ORDER BY times_bought DESC
      LIMIT 5
    `).all();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching frequent items:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.dailySpending = (req, res) => {
  try {
    const period = req.query.period || 'month';
    let whereClause = "WHERE transaction_type = 'debit'";
    let limit = 15;

    switch (period) {
      case 'day':
        whereClause += " AND date >= date('now', '-1 day')";
        limit = 1;
        break;
      case 'week':
        whereClause += " AND date >= '2025-05-25'";
        limit = 7;
        break;
      case 'month':
        whereClause += " AND date >= date('now', '-6 months')";
        limit = 180;
        break;
      case 'year':
        whereClause += " AND date >= date('now', '-2 years')";
        limit = 730;
        break;
    }

    const result = db.prepare(`
      SELECT date, SUM(amount) AS total_spent
      FROM transactions
      ${whereClause}
      GROUP BY date
      ORDER BY date DESC
      LIMIT ${limit}
    `).all();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching daily spending:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.topCreditors = (req, res) => {
  try {
    const result = db.prepare(`
      SELECT c.name, COUNT(*) AS credit_count
      FROM credit cr
      JOIN customer c ON c.id = cr.customer_id
      WHERE cr.credit_status = 'ongoing'
      GROUP BY cr.customer_id
      ORDER BY credit_count DESC
      LIMIT 5
    `).all();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching top creditors:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.biggestTransaction = (req, res) => {
  try {
    console.log("🔍 Fetching biggest transaction with description...");
    const result = db.prepare(`
      SELECT t.id, t.amount, t.transaction_type, t.date, t.time, t.description, c.name AS customer, cat.name AS category, i.name AS item
      FROM transactions t
      JOIN customer c ON t.customer_id = c.id
      JOIN category cat ON t.category_id = cat.id
      JOIN items i ON t.item_id = i.id
      ORDER BY t.amount DESC
      LIMIT 1
    `).get();

    console.log("📊 Biggest transaction result:", result);
    res.json({ biggest_transaction: result });
  } catch (err) {
    console.error("❌ Error fetching biggest transaction:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Test endpoint to verify period parameter
exports.testPeriod = (req, res) => {
  const period = req.query.period || 'month';
  console.log(`🧪 Test endpoint called with period: ${period}`);
  res.json({
    message: `Period received: ${period}`,
    timestamp: new Date().toISOString()
  });
};
