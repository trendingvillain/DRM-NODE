const pool = require('../db');

const createLandOwner = async (req, res) => {
  const { 
    name, 
    location, 
    amount, 
    phoneNumber,
    bank_name,
    account_number,
    ifsc_code,
    branch
  } = req.body;

  // Validate phone number (10 digits)
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({
      error: 'Invalid phone number. Please enter a 10-digit number.'
    });
  }

  try {

    const result = await pool.query(
      `INSERT INTO land_owners 
      (name, location, amount, phoneNumber, bank_name, account_number, ifsc_code, branch)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        name,
        location,
        amount || null,
        phoneNumber,
        bank_name,
        account_number,
        ifsc_code,
        branch
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to create land owner'
    });

  }
};


// Get all Land Owners
const getAllLandOwners = async (req, res) => {

  try {

    const result = await pool.query('SELECT * FROM land_owners');

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to retrieve land owners'
    });

  }

};


// Get Land Owner by ID
const getLandOwnerById = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      'SELECT * FROM land_owners WHERE id = $1',
      [id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({
        error: 'Land owner not found'
      });
    }

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to retrieve land owner'
    });

  }

};


// Update Land Owner
const updateLandOwner = async (req, res) => {

  const { id } = req.params;

  const { 
    name,
    location,
    amount,
    bank_name,
    account_number,
    ifsc_code,
    branch
  } = req.body;

  try {

    const checkOwner = await pool.query(
      'SELECT * FROM land_owners WHERE id = $1',
      [id]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(404).json({
        error: 'Land owner not found'
      });
    }

    const owner = checkOwner.rows[0];

    const result = await pool.query(
      `UPDATE land_owners 
       SET name = $1,
           location = $2,
           amount = $3,
           bank_name = $4,
           account_number = $5,
           ifsc_code = $6,
           branch = $7
       WHERE id = $8
       RETURNING *`,
      [
        name || owner.name,
        location || owner.location,
        amount ?? owner.amount,
        bank_name || owner.bank_name,
        account_number || owner.account_number,
        ifsc_code || owner.ifsc_code,
        branch || owner.branch,
        id
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to update land owner'
    });

  }

};

module.exports = {
  createLandOwner,
  getAllLandOwners,
  getLandOwnerById,
  updateLandOwner
};
