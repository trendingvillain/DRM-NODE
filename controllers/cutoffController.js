const express = require('express');
const pool = require('../db'); // Assuming pool is the connection to PostgreSQL database
const router = express.Router();

// Create Cutoff Record and Update LandAvailable
router.post('/:landAvailableId', async (req, res) => {
  const landAvailableId = req.params.landAvailableId; // Get LandAvailable ID from URL params
  const { name, area, variant, trees, place } = req.body; // Get the data for Cutoff

  try {
    // Fetch the LandAvailable record by its ID
    const landAvailableResult = await pool.query('SELECT * FROM land_available WHERE id = $1', [landAvailableId]);

    if (landAvailableResult.rows.length > 0) {
      const landAvailable = landAvailableResult.rows[0];

      // Subtract the trees in the Cutoff from the LandAvailable trees
      let updatedTreeCount = landAvailable.trees - trees;
      if (updatedTreeCount < 0) {
        updatedTreeCount = 0;  // Ensure that the tree count doesn't go negative
      }

      // Update the LandAvailable tree count
      await pool.query(
        'UPDATE land_available SET trees = $1 WHERE id = $2',
        [updatedTreeCount, landAvailableId]
      );

      // Create a new Cutoff record and link it to the LandAvailable record
      const result = await pool.query(
        'INSERT INTO cutoff (name, area, variant, trees, place, land_available_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, area, variant, trees, place, landAvailableId]
      );

      // Return the newly created Cutoff record
      res.status(201).json(result.rows[0]);
    } else {
      // LandAvailable not found
      res.status(404).json({ error: 'LandAvailable not found' });
    }
  } catch (error) {
    console.error(error);
    // Handle server error
    res.status(500).json({ error: 'Failed to create Cutoff' });
  }
});

// Get Cutoff Records by LandAvailable ID
router.get('/:landAvailableId/cutoffs', async (req, res) => {
  const landAvailableId = req.params.landAvailableId; // Get LandAvailable ID from URL params

  try {
    // Fetch all Cutoff records that are linked to the specified LandAvailable ID
    const result = await pool.query('SELECT * FROM cutoff WHERE land_available_id = $1', [landAvailableId]);

    if (result.rows.length > 0) {
      // Return the list of Cutoff records
      res.status(200).json(result.rows);
    } else {
      // If no Cutoff records are found, return a message
      res.status(404).json({ error: 'No Cutoff records found for this LandAvailable ID' });
    }
  } catch (error) {
    console.error(error);
    // Handle server error
    res.status(500).json({ error: 'Failed to fetch Cutoff records' });
  }
});

module.exports = router;
