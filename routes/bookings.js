const express = require('express');
const Booking = require('../models/Booking');
const Cart = require('../models/Cart');
const router = express.Router();
const auth = require('../middleware/auth');

// Create Booking
// router.post('/', auth, async (req, res) => { 
//   const { clothes, startDate, endDate } = req.body;
//   try {
//     const booking = new Booking({
//       user: req.user.id,
//       clothes,
//       startDate,
//       endDate,
//     });
//     console.log(booking);
//     await booking.save();
//     res.json(booking);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

router.post('/confirm', auth, async (req, res) => {
  const { bookingDetails } = req.body;
  const userId = req.user.id;

  try {
    // Save each booking detail to the Booking collection
    for (let detail of bookingDetails) {
      const newBooking = new Booking({
        user: userId,
        clothes: detail.clothes,
        startDate: detail.startDate,
        endDate: detail.endDate,
      });
      await newBooking.save();
    }

    // Clear the user's cart after booking
    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({ msg: 'Booking confirmed and cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to confirm booking' });
  }
});

// Get Bookings for User
router.get('/', auth, async (req, res) => {
  try {
    // const bookings = await Booking.findById( req.user.id );
    // res.json(bookings);
    const userId = req.user.id;  // Assuming the user ID is attached to req.user by your authentication middleware
    
    // console.log(userId);
    const bookings = await Booking.find({ user: userId }).populate('clothes');
    // console.log(bookings);

    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
  //   try {
  //     const userId = req.user.id;
  //     // console.log(userId);
  //     if (!userId) {
  //       return res.status(400).json({ message: 'User ID is required' });
  //     }
  //     const bookings = await Booking.find({ user: userId }).populate('clothes').populate('user');
  //     // console.log(bookings.length);
  //     if (!bookings) {
  //       return res.status(404).json({ message: 'No bookings found' });
  //     }
  //     res.status(200).json({ bookings });
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // });


module.exports = router;
