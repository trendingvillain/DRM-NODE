const db = require('../db'); // Assuming db is correctly set up with pool connection

// Create Buyer Record
async function createBuyerRecord(req, res) {
  const { buyer, visitDate, amount, varients } = req.body;

  const buyerId = buyer?.id; // Access the buyer ID

  // Validate that buyer ID exists
  if (!buyerId) {
    return res.status(400).json({ error: 'Buyer ID is required' });
  }

  try {
    // Check if the buyer exists in the buyers table before inserting the record
    const buyerCheck = await db.query(
      'SELECT id, amount FROM buyer WHERE id = $1',
      [buyerId]
    );

    if (buyerCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const buyerRecord = buyerCheck.rows[0];
    const buyerAmount = buyerRecord.amount;

    // Subtract the buyer record amount from the buyer's total amount
    const updatedBuyerAmount = buyerAmount + amount;

    // Update the buyer's amount after creating the buyer record
    await db.query(
      'UPDATE buyer SET amount = $1 WHERE id = $2',
      [updatedBuyerAmount, buyerId]
    );

    // Insert the buyer's main details into the buyer records table
    const result = await db.query(
      'INSERT INTO buyer_records (buyer_id, visit_date, amount) VALUES ($1, $2, $3) RETURNING id',
      [buyerId, visitDate, amount]
    );

    const buyerRecordId = result.rows[0].id; // Get the generated ID of the inserted record

    // Insert each variant (product) into the buyer_variants table
    const variantPromises = varients.map(variant => {
      return db.query(
        'INSERT INTO buyer_varients (buyer_record_id, product_name, quantity, price) VALUES ($1, $2, $3, $4)',
        [buyerRecordId, variant.productName, variant.quantity, variant.price]
      );
    });

    // Wait for all variant insertions to complete
    await Promise.all(variantPromises);

    return res.status(201).json({
      message: 'Buyer record and variants created successfully',
      updatedBuyerAmount
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error inserting buyer record and variants' });
  }
}

// Get all Buyer Records
const getAllBuyerRecords = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM buyer_records');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyer records' });
  }
};

// Get Buyer Records by Buyer ID
const getBuyerRecordsByBuyerId = async (req, res) => {
  const { buyerId } = req.params;

  try {
    const result = await db.query('SELECT * FROM buyer_records WHERE buyer_id = $1', [buyerId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyer records' });
  }
};

module.exports = {
  createBuyerRecord,
  getAllBuyerRecords,
  getBuyerRecordsByBuyerId,
};
