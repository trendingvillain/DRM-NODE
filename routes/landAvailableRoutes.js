const express = require('express');
const {
  createLandAvailable,
  getAllLandAvailable,
  getLandAvailableById,
  getLandAvailableByLandOwnerId,
  updateLandAvailable,
} = require('../controllers/landAvailableController');

const router = express.Router();

router.post('/', createLandAvailable);
router.get('/', getAllLandAvailable);
router.get('/:id', getLandAvailableById);
router.get('/owner/:landOwnerId', getLandAvailableByLandOwnerId);
router.put('/:id', updateLandAvailable);

module.exports = router;
