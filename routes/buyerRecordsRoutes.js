const express = require('express');
const {
  createBuyerRecord,
  getAllBuyerRecords,
  getBuyerRecordsByBuyerId,
} = require('../controllers/buyerRecordsController');

const router = express.Router();

router.post('/', createBuyerRecord);
router.get('/', getAllBuyerRecords);
router.get('/buyer/:buyerId', getBuyerRecordsByBuyerId);

module.exports = router;
