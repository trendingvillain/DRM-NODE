const db = require('../db'); // PostgreSQL connection

// Create Buyer Record
async function createBuyerRecord(req, res) {

  const { buyer, visitDate, varients } = req.body;
  const buyerId = buyer?.id;

  if (!buyerId) {
    return res.status(400).json({ error: 'Buyer ID is required' });
  }

  if (!Array.isArray(varients) || varients.length === 0) {
    return res.status(400).json({ error: 'At least one variant is required' });
  }

  try {

    // Check if buyer exists
    const buyerCheck = await db.query(
      'SELECT id, amount FROM buyer WHERE id = $1',
      [buyerId]
    );

    if (buyerCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const buyerRecord = buyerCheck.rows[0];

    // Calculate total amount
    const amount = varients.reduce(
      (sum, v) => sum + Number(v.price || 0),
      0
    );

    const updatedBuyerAmount = Number(buyerRecord.amount) + amount;

    // Update buyer total amount
    await db.query(
      'UPDATE buyer SET amount = $1 WHERE id = $2',
      [updatedBuyerAmount, buyerId]
    );

    // Insert buyer record
    const result = await db.query(
      `INSERT INTO buyer_records (buyer_id, visit_date, amount)
       VALUES ($1,$2,$3)
       RETURNING id`,
      [buyerId, visitDate, amount]
    );

    const buyerRecordId = result.rows[0].id;

    // Insert variants
    const variantPromises = varients.map((variant, index) => {

      const weight = Number(variant.weight || 0);
      const wastage = Number(variant.wastage || 0);
      const finalWeight = weight - wastage;

      return db.query(
        `INSERT INTO buyer_varients
        (buyer_record_id, product_name, quantity, price, weight, wastage, final_weight, rate, order_index)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          buyerRecordId,
          variant.productName,
          variant.quantity,
          variant.price,
          weight,
          wastage,
          finalWeight,
          variant.rate,
          index
        ]
      );

    });

    await Promise.all(variantPromises);

    return res.status(201).json({
      message: 'Buyer record and variants created successfully',
      amount,
      updatedBuyerAmount
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Error inserting buyer record and variants'
    });
  }

}


// Get all Buyer Records
const getAllBuyerRecords = async (req, res) => {

  try {

    const result = await db.query(
      'SELECT * FROM buyer_records ORDER BY visit_date DESC'
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: 'Failed to retrieve buyer records'
    });

  }

};


// Get Buyer Records by Buyer ID
const getBuyerRecordsByBuyerId = async (req, res) => {

  const { buyerId } = req.params;

  try {

    const result = await db.query(
      'SELECT * FROM buyer_records WHERE buyer_id = $1 ORDER BY visit_date DESC',
      [buyerId]
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: 'Failed to retrieve buyer records'
    });

  }

};


module.exports = {
  createBuyerRecord,
  getAllBuyerRecords,
  getBuyerRecordsByBuyerId,
};
