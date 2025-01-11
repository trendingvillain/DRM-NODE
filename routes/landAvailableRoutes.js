const express = require('express');
const {
  createLandAvailable,
  getAllLandAvailable,
  getLandAvailableById,
  updateLandAvailable,
} = require('../controllers/landAvailableController');

const router = express.Router();

router.post('/', createLandAvailable);
router.get('/', getAllLandAvailable);
router.get('/:id', getLandAvailableById);
router.put('/:id', updateLandAvailable);

module.exports = router;
