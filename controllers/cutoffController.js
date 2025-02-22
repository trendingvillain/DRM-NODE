const express = require('express');
const pool = require('../db'); // PostgreSQL connection
const router = express.Router();

// Create Cutoff Record and Update LandAvailable
router.post('/:landAvailableId', async (req, res) => {
  const landAvailableId = req.params.landAvailableId;
  const { 
    name, 
    area, 
    variant, 
    trees, 
    place, 
    amount = 0,  // Default to 0 if undefined
    weight = 0,
    ship // Ensure this is correctly sent from frontend
  } = req.body;

  console.log("Received Data:", req.body); // Debugging log

  try {
    // Fetch the LandAvailable record by its ID
    const landAvailableResult = await pool.query('SELECT * FROM land_available WHERE id = $1', [landAvailableId]);

    if (landAvailableResult.rows.length > 0) {
      const landAvailable = landAvailableResult.rows[0];

      let updatedTreeCount = landAvailable.trees - trees;
      if (updatedTreeCount < 0) updatedTreeCount = 0;

      // Update LandAvailable tree count
      await pool.query(
        'UPDATE land_available SET trees = $1 WHERE id = $2',
        [updatedTreeCount, landAvailableId]
      );

      // Insert into cutoff table
      const result = await pool.query(
        'INSERT INTO cutoff (name, area, variant, trees, place, amount, weight, land_available_id, ship) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [name, area, variant, trees, place, Number(amount), Number(weight), landAvailableId, ship]
      );
      res.status(201).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'LandAvailable not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Cutoff' });
  }
});

// Get Cutoff Records by LandAvailable ID
router.get('/:landAvailableId/cutoffs', async (req, res) => {
  const landAvailableId = req.params.landAvailableId;

  try {
    const result = await pool.query('SELECT * FROM cutoff WHERE land_available_id = $1', [landAvailableId]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: 'No Cutoff records found for this LandAvailable ID' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Cutoff records' });
  }
});

// ✅ Get All Cutoff Records
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cutoff');

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: 'No Cutoff records found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all Cutoff records' });
  }
});

module.exports = router;
