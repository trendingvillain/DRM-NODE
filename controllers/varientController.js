const db = require('../db');

// Get all variants for a specific buyer record
const getVariantsByBuyerRecordId = async (req, res) => {
  const { buyerRecordId } = req.params;

  if (!buyerRecordId) {
    return res.status(400).json({ error: 'buyerRecordId is required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM buyer_variants WHERE buyer_record_id = $1',
      [buyerRecordId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching variants:', error.message);
    res.status(500).json({ error: 'Failed to fetch variants', details: error.message });
  }
};

// Create a variant for a buyer record
const createVariantForBuyerRecord = async (req, res) => {
  const { buyerRecordId } = req.params;
  const { product_name, quantity, price, weight, rate } = req.body;

  if (!buyerRecordId || !product_name || !quantity || !price || !weight || !rate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO buyer_variants (buyer_record_id, product_name, quantity, price, weight, rate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [buyerRecordId, product_name, quantity, price, weight, rate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating variant:', error.message);
    res.status(500).json({ error: 'Failed to create variant', details: error.message });
  }
};

// Update a variant for a buyer record
const updateVariantForBuyerRecord = async (req, res) => {
  const { variantId } = req.params;
  const { product_name, quantity, price, weight, rate } = req.body;

  if (!variantId || !product_name || !quantity || !price || !weight || !rate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'UPDATE buyer_variants SET product_name = $1, quantity = $2, price = $3, weight = $4, rate = $5 WHERE id = $6 RETURNING *',
      [product_name, quantity, price, weight, rate, variantId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Variant not found' });
    }
  } catch (error) {
    console.error('Error updating variant:', error.message);
    res.status(500).json({ error: 'Failed to update variant', details: error.message });
  }
};

// Delete a variant by ID
const deleteVariantById = async (req, res) => {
  const { variantId } = req.params;

  if (!variantId) {
    return res.status(400).json({ error: 'variantId is required' });
  }

  try {
    const result = await db.query(
      'DELETE FROM buyer_variants WHERE id = $1 RETURNING *',
      [variantId]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Variant deleted successfully', deletedVariant: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Variant not found' });
    }
  } catch (error) {
    console.error('Error deleting variant:', error.message);
    res.status(500).json({ error: 'Failed to delete variant', details: error.message });
  }
};

module.exports = {
  getVariantsByBuyerRecordId,
  createVariantForBuyerRecord,
  updateVariantForBuyerRecord,
  deleteVariantById,
};
