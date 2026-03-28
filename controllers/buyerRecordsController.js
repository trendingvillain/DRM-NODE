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

  // Get a single client from the pool for the transaction
  const client = await db.connect();

  try {
    await client.query('BEGIN'); // START TRANSACTION

    // 1. Check if buyer exists & Lock row to prevent race conditions
    const buyerCheck = await client.query(
      'SELECT id, amount FROM buyer WHERE id = $1 FOR UPDATE',
      [buyerId]
    );

    if (buyerCheck.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const buyerRecord = buyerCheck.rows[0];

    // 2. Calculate total amount (using Number to handle strings/floats safely)
    const amount = varients.reduce(
      (sum, v) => sum + Number(v.price || 0),
      0
    );

    const updatedBuyerAmount = Number(buyerRecord.amount) + amount;

    // 3. Update buyer total amount
    await client.query(
      'UPDATE buyer SET amount = $1 WHERE id = $2',
      [updatedBuyerAmount, buyerId]
    );

    // 4. Insert buyer record
    const result = await client.query(
      `INSERT INTO buyer_records (buyer_id, visit_date, amount)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [buyerId, visitDate || new Date(), amount]
    );

    const buyerRecordId = result.rows[0].id;

    // 5. Insert variants (Sequential processing inside transaction)
    for (const [index, variant] of varients.entries()) {
      const weight = Number(variant.weight || 0);
      const wastage = Number(variant.wastage || 0);
      const finalWeight = weight - wastage;
      const rate = Number(variant.rate || 0); // Handle float rate

      await client.query(
        `INSERT INTO buyer_varients
        (buyer_record_id, product_name, quantity, price, weight, wastage, final_weight, rate, order_index)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          buyerRecordId,
          variant.productName,
          variant.quantity,
          variant.price,
          weight,
          wastage,
          finalWeight,
          rate,
          index
        ]
      );
    }

    await client.query('COMMIT'); // SUCCESS - SAVE EVERYTHING

    return res.status(201).json({
      message: 'Buyer record and variants created successfully',
      amount,
      updatedBuyerAmount
    });

  } catch (err) {
    await client.query('ROLLBACK'); // ERROR - UNDO EVERYTHING
    console.error("TRANSACTION ERROR:", err);
    return res.status(500).json({
      error: 'Error inserting buyer record and variants',
      details: err.message // Now you'll see exactly why it failed in the response
    });
  } finally {
    client.release(); // Return client to pool
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
