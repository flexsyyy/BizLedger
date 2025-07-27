const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const transactionsRoutes = require('./routes/transactionsRoutes');
const transcribeRoutes = require('./routes/transcribeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const creditsRoutes = require('./routes/creditsRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const queryRoutes = require('./routes/queryRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Mount the route with correct path
app.use('/transactions', transactionsRoutes);
app.use('/transcribe', transcribeRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/credits', creditsRoutes);
app.use('/items', itemsRoutes);
app.use('/mcp', queryRoutes);  // Mounts POST /mcp/query
app.use('/ledger', ledgerRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
