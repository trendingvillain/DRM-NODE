const pool = require('../db');

// Create Land Available
const createLandAvailable = async (req, res) => {
  const { name, area, place, varient, trees } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO land_available (name, area, place, varient, trees) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, area, place, varient, trees]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create land available' });
  }
};

// Get all Land Available
const getAllLandAvailable = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM land_available');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve land available' });
  }
};

// Get Land Available by ID
const getLandAvailableById = async (req, res) => {
  const { id } = req.params;  // Get the ID from the route parameter

  try {
    const result = await pool.query('SELECT * FROM land_available WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);  // Return the found land available record
    } else {
      res.status(404).json({ error: 'Land available record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve land available' });
  }
};

// Update Land Available by ID
const updateLandAvailable = async (req, res) => {
  const { id } = req.params;
  const { name, area, place, varient, trees } = req.body;

  try {
    const result = await pool.query(
      `UPDATE land_available 
       SET name = $1, area = $2, place = $3, varient = $4, trees = $5 
       WHERE id = $6 
       RETURNING *`,
      [name, area, place, varient, trees, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Land available record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update land available' });
  }
};

module.exports = { createLandAvailable, getAllLandAvailable, getLandAvailableById, updateLandAvailable };
