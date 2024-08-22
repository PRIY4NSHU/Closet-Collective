// src/pages/Cart.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedCart = calculateTotalAmount(res.data);
        setCart(updatedCart);
      } catch (err) {
        console.error('Error fetching cart:', err);
        alert('Error fetching cart');
      }
    };

    fetchCart();
  }, [isAuthenticated, navigate]);

  const calculateTotalAmount = (cartData) => {
    let totalAmount = 0;
    cartData.items.forEach((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      totalAmount += item.clothes.price * rentalDays;
    });
    return { ...cartData, totalAmount };
  };

  const handleRemoveItem = async (clothesId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${clothesId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.clothes._id !== clothesId),
      }));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Error removing item from cart');
    }
  };

  const handleCheckout = () => {
    navigate('/payment', { state: { totalAmount: cart.totalAmount, items: cart.items } }); // Pass totalAmount and items to payment page
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.clothes._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <h2>{item.clothes.name}</h2>
              <p>{item.clothes.description}</p>
              {item.clothes.image && <img src={item.clothes.image} alt={item.clothes.name} style={{ width: '150px', height: 'auto' }} />}
              <p>₹ {item.clothes.price} per day</p>
              <p>
                Rental period: {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
              </p>
              <p>
                Total for this item: ₹{item.clothes.price * (Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) + 1)}
              </p>
              <button onClick={() => handleRemoveItem(item.clothes._id)}>Remove</button>
            </div>
          ))}
          <h3>Total Amount: ₹{cart.totalAmount}</h3>
          <button onClick={handleCheckout}>Proceed to Payment</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
