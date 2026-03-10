const pool = require('../db');


// Create Miscellaneous
const createMiscellaneous = async (req, res) => {

  const { date, reason, amount } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO miscellaneous (date, reason, amount)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [date, reason, amount]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to create miscellaneous record'
    });

  }

};



// Get all miscellaneous
const getAllMiscellaneous = async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM miscellaneous ORDER BY date DESC'
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch miscellaneous records'
    });

  }

};



// Get by ID
const getMiscellaneousById = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      'SELECT * FROM miscellaneous WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch record'
    });

  }

};



// Update
const updateMiscellaneous = async (req, res) => {

  const { id } = req.params;
  const { date, reason, amount } = req.body;

  try {

    const result = await pool.query(
      `UPDATE miscellaneous
       SET date = $1,
           reason = $2,
           amount = $3
       WHERE id = $4
       RETURNING *`,
      [date, reason, amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to update record'
    });

  }

};



// Delete
const deleteMiscellaneous = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      'DELETE FROM miscellaneous WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({
      message: 'Record deleted successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to delete record'
    });

  }

};



module.exports = {
  createMiscellaneous,
  getAllMiscellaneous,
  getMiscellaneousById,
  updateMiscellaneous,
  deleteMiscellaneous
};
