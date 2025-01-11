const express = require('express');
const {
  createBuyer,
  getAllBuyers,
  getBuyerById,
  deleteBuyer,
  getBuyersByLocation,
} = require('../controllers/buyerController');

const router = express.Router();

router.post('/', createBuyer);
router.get('/', getAllBuyers);
router.get('/:id', getBuyerById);
router.get('/location/:location', getBuyersByLocation);
router.delete('/:id', deleteBuyer);

module.exports = router;
