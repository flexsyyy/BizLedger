const db = require('../db/db');

exports.getAllItems = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT i.id, i.name, i.unit, i.price_per_unit, c.name AS category
      FROM items i
      LEFT JOIN category c ON i.default_category_id = c.id
      ORDER BY i.name ASC
    `).all();

    res.json({ items: rows });
  } catch (err) {
    console.error("❌ Error fetching items:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getItemStock = (req, res) => {
  try {
    const { item_id } = req.params;

    const row = db.prepare(`
      SELECT 
        i.name,
        SUM(stock_in) as stock_in,
        SUM(stock_out) as stock_out,
        SUM(stock_in - stock_out) as net_stock
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE item_id = ?
      GROUP BY i.name
    `).get(item_id);

    if (!row) return res.status(404).json({ error: "Item not found or no inventory data." });

    res.json(row);
  } catch (err) {
    console.error("❌ Error fetching item stock:", err.message);
    res.status(500).json({ error: err.message });
  }
};
