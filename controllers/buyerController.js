const pool = require('../db');

// Create a new Buyer
const createBuyer = async (req, res) => {
  const { name, location, amount } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO buyer (name, location, amount) VALUES ($1, $2, $3) RETURNING *',
      [name, location, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create buyer' });
  }
};


// Get all Buyers
const getAllBuyers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buyer');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyers' });
  }
};

// Get Buyer by ID
const getBuyerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM buyer WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Buyer not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyer' });
  }
};

// Get Buyers by Location
const getBuyersByLocation = async (req, res) => {
  const { location } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM buyer WHERE location ILIKE $1',
      [`%${location}%`]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyers by location' });
  }
};

// Delete Buyer by ID
const deleteBuyer = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM buyer WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete buyer' });
  }
};

module.exports = { createBuyer, getAllBuyers, getBuyerById, deleteBuyer, getBuyersByLocation };
