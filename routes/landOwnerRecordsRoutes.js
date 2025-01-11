const express = require('express');
const {
  createLandOwnerRecord,
  getAllLandOwnerRecords,
  getLandOwnerRecordsByOwnerId,
} = require('../controllers/landOwnerRecordsController');

const router = express.Router();

router.post('/', createLandOwnerRecord);
router.get('/', getAllLandOwnerRecords);
router.get('/owner/:ownerId', getLandOwnerRecordsByOwnerId);

module.exports = router;
