const pool = require('../db');

// Create Land Owner
const createLandOwner = async (req, res) => {
  const { name, location, amount } = req.body;

  try {
    // Set amount to null if not provided in the request body
    const result = await pool.query(
      'INSERT INTO land_owners (name, location, amount) VALUES ($1, $2, $3) RETURNING *',
      [name, location, amount || null]  // If amount is not provided, set it as null
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create land owner' });
  }
};

// Get all Land Owners
const getAllLandOwners = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM land_owners');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve land owners' });
  }
};

// Get Land Owner by ID
const getLandOwnerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM land_owners WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Land owner not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve land owner' });
  }
};

// Update Land Owner
const updateLandOwner = async (req, res) => {
  const { id } = req.params;
  const { name, location, amount } = req.body;

  try {
    // Fetch the land owner by ID to ensure it exists
    const checkOwner = await pool.query('SELECT * FROM land_owners WHERE id = $1', [id]);

    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Land owner not found' });
    }

    // Update the land owner's details
    const result = await pool.query(
      'UPDATE land_owners SET name = $1, location = $2, amount = $3 WHERE id = $4 RETURNING *',
      [name || checkOwner.rows[0].name, location || checkOwner.rows[0].location, amount || checkOwner.rows[0].amount, id]
    );

    res.status(200).json(result.rows[0]);  // Return the updated land owner
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update land owner' });
  }
};

module.exports = { createLandOwner, getAllLandOwners, getLandOwnerById, updateLandOwner };
