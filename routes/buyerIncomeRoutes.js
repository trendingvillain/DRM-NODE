const express = require('express');
const {
  createBuyerIncome,
  getAllBuyerIncomes,
  getBuyerIncomeById,
  getBuyerIncomeByBuyerId,
} = require('../controllers/buyerIncomeController');

const router = express.Router();

router.post('/', createBuyerIncome);
router.get('/', getAllBuyerIncomes);
router.get('/:id', getBuyerIncomeById);
router.get('/buyer/:buyerId', getBuyerIncomeByBuyerId);

module.exports = router;
