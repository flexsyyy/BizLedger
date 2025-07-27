const express = require('express');
const router = express.Router();
const analytics = require('../controllers/analyticsController');

router.get('/customer-balances', analytics.customerBalances);
router.get('/total-income', analytics.totalIncome);
router.get('/total-expense', analytics.totalExpense);
router.get('/top-categories', analytics.topSpendingCategories);
router.get('/monthly-summary', analytics.monthlySummary);
router.get('/category-trends', analytics.categoryTrends);
router.get('/frequent-items', analytics.frequentItems);
router.get('/daily-spending', analytics.dailySpending);
router.get('/top-creditors', analytics.topCreditors);
router.get('/biggest-transaction', analytics.biggestTransaction);
router.get('/test-period', analytics.testPeriod);

module.exports = router;
