const pool = require('../db');

// Create Land Owner Record and Update Amount
const createLandOwnerRecord = async (req, res) => {
  const { landOwner, reason, visitDate, amount } = req.body;

  try {
    // Start a transaction to ensure consistency
    await pool.query('BEGIN');

    // Insert the land owner record
    const result = await pool.query(
      'INSERT INTO land_owner_records (owner_id, reason, visit_date, amount) VALUES ($1, $2, $3, $4) RETURNING *',
      [landOwner.id, reason, visitDate, amount]
    );

    const newRecord = result.rows[0];

    // Update the land owner's amount by deducting the visit amount
    await pool.query(
      'UPDATE land_owners SET amount = amount - $1 WHERE id = $2',
      [amount, landOwner.id]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Land owner record created and owner amount updated successfully',
      landOwnerRecord: newRecord
    });
  } catch (error) {
    // In case of an error, rollback the transaction
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to create land owner record and update amount' });
  }
};

// Get all Land Owner Records
const getAllLandOwnerRecords = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM land_owner_records');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve land owner records' });
  }
};

// Get Land Owner Records by Owner ID
const getLandOwnerRecordsByOwnerId = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM land_owner_records WHERE owner_id = $1', [ownerId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: 'No records found for this owner' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve land owner records' });
  }
};

module.exports = {
  createLandOwnerRecord,
  getAllLandOwnerRecords,
  getLandOwnerRecordsByOwnerId,
};
