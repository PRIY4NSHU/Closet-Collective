// routes/clothes.js
const express = require('express');
const Clothes = require('../models/Clothes');
const router = express.Router();
const Booking = require('../models/Booking');
// Add Clothes
router.post('/', async (req, res) => {
  const { owner, name, description, price, image } = req.body;
  try {
    const clothes = new Clothes({ owner, name, description, price, image });
    await clothes.save();
    res.json(clothes);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get All Clothes
router.get('/', async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.json(clothes);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Check Availability
router.post('/check-availability', async (req, res) => {
  const { clothesId, startDate, endDate } = req.body;

  try {
    const bookings = await Booking.find({
      clothes: clothesId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
    });
    if (bookings.length > 0) {
      return res.status(400).json({ msg: 'Clothes not available for the selected dates. Please try some other dates' });
    }

    res.json({ msg: 'Clothes available' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
