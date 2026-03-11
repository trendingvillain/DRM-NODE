const express = require('express');
const pool = require('../db'); // PostgreSQL connection
const router = express.Router();

// Create Cutoff Record and Update LandAvailable
router.post('/:landAvailableId', async (req, res) => {
  const landAvailableId = req.params.landAvailableId;

  const { 
    name, 
    area, 
    varient, 
    trees, 
    place, 
    amount = 0,
    weight = 0,
    ship,
    no_of_palam = 0,
    cut_by_person
  } = req.body;

  console.log("Received Data:", req.body);

  try {

    const landAvailableResult = await pool.query(
      'SELECT * FROM land_available WHERE id = $1',
      [landAvailableId]
    );

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
        `INSERT INTO cutoff 
        (name, area, varient, trees, place, amount, weight, land_available_id, ship, no_of_palam, cut_by_person)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *`,
        [
          name,
          area,
          varient,
          trees,
          place,
          Number(amount),
          Number(weight),
          landAvailableId,
          ship,
          Number(no_of_palam),
          cut_by_person
        ]
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
    const result = await pool.query(
      'SELECT * FROM cutoff WHERE land_available_id = $1',
      [landAvailableId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Cutoff records' });
  }
});


// Get All Cutoff Records
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        la.varient,
        lo.name AS owner_name
      FROM cutoff c
      JOIN land_available la 
        ON c.land_available_id = la.id
      JOIN land_owners lo
        ON la.land_owner_id = lo.id
      ORDER BY c.created_date DESC
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all Cutoff records' });
  }
});
module.exports = router;
