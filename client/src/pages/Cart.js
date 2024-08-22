// src/pages/Cart.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import './Cart.css'; // Import the CSS file

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if(!res.data) return;
        if (res.data && res.data.items && Array.isArray(res.data.items)) {
          const updatedCart = calculateTotalAmount(res.data);
          setCartItems(res.data.items);
          setTotalAmount(updatedCart.totalAmount);
        } else {
          console.error('Unexpected data format:', res.data);
          alert('Error fetching cart items');
        }
      } catch (err) {
        console.error(err);
        alert('Error fetching cart items');
      }
    };

    fetchCartItems();
  }, [isAuthenticated, navigate]);

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);

      alert('Item removed from cart');
    } catch (err) {
      console.error(err);
      alert('Error removing item from cart');
    }
  };

  const calculateTotal = (cartData) => {
    // const total = items.reduce((sum, item) => sum + (item.clothes ? item.clothes.price : 0), 0);
    let totalAmount = 0;
    cartData.forEach((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate rental days
      totalAmount += item.clothes.price * rentalDays; // Multiply by price per day
    });
    setTotalAmount(totalAmount);
  };

  const calculateTotalAmount = (cartData) => {
    let totalAmount = 0;
    cartData.items.forEach((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate rental days
      totalAmount += item.clothes.price * rentalDays; // Multiply by price per day
    });
    return { ...cartData, totalAmount };
  };

  const proceedToPayment = () => {
    const bookingDetails = cartItems.map(item => ({
      clothes: item.clothes._id,
      startDate: item.startDate,
      endDate: item.endDate,
    }));

    navigate('/payment', { state: { totalAmount, bookingDetails } });
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div>
          <div className="cart-items-grid">
            {cartItems.map((item) => (
              <div className="cart-item-card" key={item._id}>
                <div class="cart-item-image-container">
                  {item.clothes.image && (
                    <img
                      className="cart-item-image"
                      src={item.clothes.image}
                      alt={item.clothes.name}
                    />
                  )}
                </div>
                <div className='cart-item-name-and-desc'>
                  <h2 className="cart-item-name">{item.clothes.name}</h2>
                  <p className="cart-item-description">{item.clothes.description}</p>
                </div>  
                <p className="cart-item-price">Price: <br></br> ₹{item.clothes.price}/day</p>
                <p className="cart-item-dates">
                  Rental Dates:<br></br> {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                </p>
                <div>
                  <h3 className="total-amount">Total:<br></br> ₹{item.clothes.price * (Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) + 1)}</h3>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>  
              </div>
            ))}
          </div>
          <h3 className="total-amount">Grand Total: ₹ {totalAmount}</h3>
          {/* <h3 className="total-amount">Total: ₹ {cart.totalAmount}</h3> */}
          <button
            className="payment-button"
            onClick={proceedToPayment}
            disabled={cartItems.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
