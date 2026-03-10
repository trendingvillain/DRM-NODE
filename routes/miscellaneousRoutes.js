const express = require('express');
const router = express.Router();

const {
  createMiscellaneous,
  getAllMiscellaneous,
  getMiscellaneousById,
  updateMiscellaneous,
  deleteMiscellaneous
} = require('../controllers/miscellaneousController');


router.post('/', createMiscellaneous);
router.get('/', getAllMiscellaneous);
router.get('/:id', getMiscellaneousById);
router.put('/:id', updateMiscellaneous);
router.delete('/:id', deleteMiscellaneous);


module.exports = router;
