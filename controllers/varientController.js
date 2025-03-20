const db = require('../db');

// Get all variants for a specific buyer record
const getVariantsByBuyerRecordId = async (req, res) => {
  const { buyerRecordId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM buyer_varients WHERE buyer_record_id = $1',
      [buyerRecordId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch variants' });
  }
};

// Create a variant for a buyer record
const createVariantForBuyerRecord = async (req, res) => {
  const { buyerRecordId } = req.params;
  const { product_name, quantity, price, weight, rate } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO buyer_varients (buyer_record_id, product_name, quantity, price, weight, rate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [buyerRecordId, product_name, quantity, price, weight, rate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create variant' });
  }
};

// Update a variant for a buyer record
const updateVariantForBuyerRecord = async (req, res) => {
  const { variantId } = req.params;
  const { product_name, quantity, price, weight } = req.body;

  try {
    const result = await db.query(
      'UPDATE buyer_varients SET product_name = $1, quantity = $2, price = $3, weight = $4 WHERE id = $5 RETURNING *',
      [product_name, quantity, price, weight, variantId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Variant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update variant' });
  }
};

// Delete a variant by ID
const deleteVariantById = async (req, res) => {
  const { variantId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM buyer_varients WHERE id = $1 RETURNING *',
      [variantId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Variant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete variant' });
  }
};

module.exports = {
  getVariantsByBuyerRecordId,
  createVariantForBuyerRecord,
  updateVariantForBuyerRecord,
  deleteVariantById,
};
