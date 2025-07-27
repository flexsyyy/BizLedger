const db = require('../db/db');

exports.logTransaction = (req, res) => {
  try {
    let {
      transaction_type,
      amount,
      customer_name,
      category_name,
      item_name,
      quantity,
      unit_price,
      on_credit,
      description,
      date,
      time,
    } = req.body;

    // ✅ Apply safe defaults
    transaction_type = transaction_type || 'debit';
    amount = amount || 0;
    customer_name = customer_name?.trim() || (transaction_type === 'debit' ? 'me' : 'general');
    category_name = category_name?.trim() || 'general';
    item_name = item_name?.trim() || 'general';
    quantity = quantity || 1;
    unit_price = unit_price || 0;
    on_credit = on_credit ? 1 : 0;
    description = description || `${transaction_type} ${item_name}`;
    date = date || new Date().toISOString().slice(0, 10);
    time = time || new Date().toISOString().slice(11, 19);

    // 🔁 Credit repayment detection
    // 🔁 Credit repayment detection (based on description only)
    const isRepayment = /repay|paid back|loan back|return(ed)?/i.test(description);

    if (isRepayment) {
      const customer = db.prepare(`SELECT id FROM customer WHERE name = ?`).get(customer_name);
      if (customer) {
        const openCredit = db.prepare(`
          SELECT id FROM credit 
          WHERE customer_id = ? AND credit_status = 'ongoing' 
          ORDER BY id LIMIT 1
        `).get(customer.id);

        if (openCredit) {
          db.prepare(`
            UPDATE credit 
            SET credit_status = 'paid', date_paid = CURRENT_DATE 
            WHERE id = ?
          `).run(openCredit.id);
          console.log(`✅ Marked credit as paid for customer: ${customer_name}`);
        }
      }
    }

    // 1. Customer
    let customer = db.prepare(`SELECT id FROM customer WHERE name = ?`).get(customer_name);
    if (!customer) {
      const result = db.prepare(`INSERT INTO customer (name) VALUES (?)`).run(customer_name);
      customer = { id: result.lastInsertRowid };
    }

    // 2. Category
    let category = db.prepare(`SELECT id FROM category WHERE name = ?`).get(category_name);
    if (!category) {
      const result = db.prepare(`INSERT INTO category (name) VALUES (?)`).run(category_name);
      category = { id: result.lastInsertRowid };
    }

    // 3. Item
    let item = db.prepare(`SELECT id FROM items WHERE name = ?`).get(item_name);
    if (!item) {
      const result = db.prepare(`
        INSERT INTO items (name, price_per_unit, default_category_id)
        VALUES (?, ?, ?)
      `).run(item_name, unit_price, category.id);
      item = { id: result.lastInsertRowid };
    }

    // 4. Insert transaction
    const txnStmt = db.prepare(`
      INSERT INTO transactions (
        transaction_type, amount, customer_id, category_id, item_id,
        quantity, unit_price, on_credit, description, date, time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    txnStmt.run(
      transaction_type,
      amount,
      customer.id,
      category.id,
      item.id,
      quantity,
      unit_price,
      on_credit,
      description,
      date,
      time
    );

    // 5. Credit tracking
    if (on_credit) {
      const txnId = db.prepare(`SELECT last_insert_rowid() AS id`).get().id;
      db.prepare(`
        INSERT INTO credit (txn_id, customer_id, credit_status)
        VALUES (?, ?, 'ongoing')
      `).run(txnId, customer.id);
    }

    // 6. Inventory update (for credit sale)
    if (transaction_type === 'credit') {
      const stock = db.prepare(`SELECT id FROM inventory WHERE item_id = ? AND date = CURRENT_DATE`).get(item.id);
      if (stock) {
        db.prepare(`UPDATE inventory SET stock_out = stock_out + ? WHERE item_id = ? AND date = CURRENT_DATE`)
          .run(quantity, item.id);
      } else {
        db.prepare(`INSERT INTO inventory (item_id, stock_out) VALUES (?, ?)`).run(item.id, quantity);
      }
    }

    res.json({ status: 'success', message: 'Transaction logged successfully.' });
  } catch (err) {
    console.error("❌ Error logging transaction:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTransactionsSummary = (req, res) => {
  try {
    const query = `
      SELECT 
        c.name AS customer_name,
        cat.name AS category,
        t.transaction_type,
        t.amount,
        t.date,
        t.time
      FROM transactions t
      JOIN customer c ON t.customer_id = c.id
      JOIN category cat ON t.category_id = cat.id
      ORDER BY t.date DESC, t.time DESC
    `;

    const result = db.prepare(query).all();

    res.json({ status: 'success', transactions: result });
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    res.status(500).json({ error: err.message });
  }
};
