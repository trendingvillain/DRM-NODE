const express = require('express');
const {
  createLandOwner,
  getAllLandOwners,
  getLandOwnerById,
  updateLandOwner,
} = require('../controllers/landOwnerController');

const router = express.Router();

router.post('/', createLandOwner);
router.get('/', getAllLandOwners);
router.get('/:id', getLandOwnerById);
router.put('/:id', updateLandOwner);

module.exports = router;
