const express = require('express');
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Clothes = require('../models/Clothes');
const router = express.Router();

// Get the current user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.clothes');
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err.message);
    res.status(500).send('Server error');
  }
});

// Add items to cart
router.post('/add', auth, async (req, res) => {
  const { clothesId, startDate, endDate } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    const clothes = await Clothes.findById(clothesId);
    if (!clothes) return res.status(404).json({ msg: 'Clothes not found' });

    const item = {
      clothes: clothesId,
      startDate,
      endDate,
    };

    if (cart) {
      cart.items.push(item);
      cart.totalAmount += clothes.price;
    } else {
      cart = new Cart({
        user: req.user.id,
        items: [item],
        totalAmount: clothes.price,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error adding item to cart:', err.message);
    res.status(500).send('Server error');
  }
});

// Remove items from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.clothes');
    if (!cart) {
      console.error('Cart not found');
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);

    if (itemIndex === -1) {
      console.error('Item not found in cart');
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    const itemPrice = cart.items[itemIndex].clothes.price;
    // console.log('Removing item at index:', itemIndex);
    // console.log('Item price:', itemPrice);

    // Update the total amount
    cart.totalAmount -= itemPrice;

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error removing item from cart:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
