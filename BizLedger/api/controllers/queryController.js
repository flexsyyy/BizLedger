const db = require('../db/db');

exports.executeDynamicQuery = (req, res) => {
  try {
    const { sql } = req.body;

    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ error: "Invalid or missing SQL query." });
    }

    const stmt = db.prepare(sql);

    // SELECT → fetch results; others → run without result
    const isSelect = sql.trim().toLowerCase().startsWith("select");
    const result = isSelect ? stmt.all() : stmt.run();

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ SQL Execution Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
