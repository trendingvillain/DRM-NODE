const pool = require('../db');

const createBuyerIncome = async (req, res) => {
  const { visitDate, amount, buyer } = req.body;
  const buyerId = buyer.id;  // Extract the buyerId from the nested buyer object

  try {
    // Check if the buyer exists in the database
    const buyerResult = await pool.query('SELECT * FROM buyer WHERE id = $1', [buyerId]);

    if (buyerResult.rows.length === 0) {
      console.log("Buyer not found for ID:", buyerId);
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const buyer = buyerResult.rows[0];

    // Subtract the income amount from the Buyer's total amount
    const updatedAmount = buyer.amount - amount;
    if (updatedAmount < 0) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Update the buyer's balance
    await pool.query('UPDATE buyer SET amount = $1 WHERE id = $2', [updatedAmount, buyerId]);

    // Insert the new BuyerIncome record into the database
    await pool.query('INSERT INTO buyer_income (buyer_id, amount, visit_date) VALUES ($1, $2, $3)', [buyerId, amount, visitDate]);

    res.status(201).json({ message: 'Buyer Income created successfully' });
  } catch (error) {
    console.error('Error in creating buyer income:', error);
    res.status(500).json({ error: 'Failed to create buyer income' });
  }
};
// Get all Buyer Incomes
const getAllBuyerIncomes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buyer_income');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyer incomes' });
  }
};

// Get Buyer Income by ID
const getBuyerIncomeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM buyer_income WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Buyer income not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyer income' });
  }
};

// Get Buyer Incomes by Buyer ID
const getBuyerIncomeByBuyerId = async (req, res) => {
  const { buyerId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM buyer_income WHERE buyer_id = $1', [buyerId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve buyer incomes by buyer ID' });
  }
};

module.exports = {
  createBuyerIncome,
  getAllBuyerIncomes,
  getBuyerIncomeById,
  getBuyerIncomeByBuyerId,
};
