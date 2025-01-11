const express = require('express');
const router = express.Router();
const buyerVarientController = require('../controllers/varientController');

// Get all variants for a specific buyer record
router.get('/:buyerRecordId', buyerVarientController.getVariantsByBuyerRecordId);

// Create a new variant for a buyer record
router.post('/:buyerRecordId', buyerVarientController.createVariantForBuyerRecord);

// Update a variant for a buyer record
router.put('/:variantId', buyerVarientController.updateVariantForBuyerRecord);

// Delete a variant by ID
router.delete('/:variantId', buyerVarientController.deleteVariantById);

module.exports = router;
