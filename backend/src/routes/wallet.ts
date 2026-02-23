import express from 'express';
import { getDatabase } from '../models/database';

const router = express.Router();

router.get('/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDatabase();
    
    const wallet = await db.get(
      'SELECT balance FROM wallets WHERE user_id = ?',
      [userId]
    );

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || amount === undefined || amount <= 0) {
      return res.status(400).json({ error: 'Valid user ID and positive amount are required' });
    }

    const db = getDatabase();
    
    await db.run(
      'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
      [amount, userId]
    );

    const updatedWallet = await db.get(
      'SELECT balance FROM wallets WHERE user_id = ?',
      [userId]
    );

    res.json({
      message: 'Amount added successfully',
      balance: updatedWallet.balance
    });
  } catch (error) {
    console.error('Error adding money to wallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/deduct', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || amount === undefined || amount <= 0) {
      return res.status(400).json({ error: 'Valid user ID and positive amount are required' });
    }

    const db = getDatabase();
    
    const wallet = await db.get(
      'SELECT balance FROM wallets WHERE user_id = ?',
      [userId]
    );

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await db.run(
      'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
      [amount, userId]
    );

    const updatedWallet = await db.get(
      'SELECT balance FROM wallets WHERE user_id = ?',
      [userId]
    );

    res.json({
      message: 'Amount deducted successfully',
      balance: updatedWallet.balance
    });
  } catch (error) {
    console.error('Error deducting money from wallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
