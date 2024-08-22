// src/pages/ViewClothes.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import './ViewClothes.css'; // Import the CSS file
// import '../App.css';

const ViewClothes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [clothes, setClothes] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      const res = await axios.get('http://localhost:5000/api/clothes');
      setClothes(res.data);
    };
    fetchClothes();
  }, []);

  const checkAvailability = async (clothesId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/clothes/check-availability', {
        clothesId,
        startDate,
        endDate,
      });

      setAvailability((prev) => ({
        ...prev,
        [clothesId]: true, // Clothes are available
      }));
      alert('Clothes are available for the selected dates.');
    } catch (err) {
      setAvailability((prev) => ({
        ...prev,
        [clothesId]: false, // Clothes are not available
      }));
      alert(err.response.data.msg || 'Clothes not available for the selected dates.');
    }
  };

  const addToCart = async (clothesId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!availability[clothesId]) {
      alert('Please check availability first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',
        {
          clothesId,
          startDate,
          endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Clothes added to cart successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding clothes to cart');
    }
  };

  return (
    <div className="view-clothes-container">
      <h1 className="view-clothes-title">Available Clothes</h1>
      <div className="clothes-grid">
        {clothes.map((clothesItem) => (
          <div className="clothes-card" key={clothesItem._id}>
            <h2 className="clothes-name">{clothesItem.name}</h2>
            {clothesItem.image && (
              <img
                className="clothes-image"
                src={clothesItem.image}
                alt={clothesItem.name}
              />
            )}
            <p className="clothes-description">{clothesItem.description}</p>
            <p className="clothes-price">₹ {clothesItem.price}/day</p>
            <div className="availability-container">
              <label>Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              /><br/>
              <label>End Date: </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className="availability-button"
                onClick={() => checkAvailability(clothesItem._id)}
              >
                Check Availability
              </button>
              <button
                className="cart-button"
                data-tooltip="Check availability first"
                onClick={() => addToCart(clothesItem._id)}
                disabled={!availability[clothesItem._id]}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="go-to-cart-button" onClick={() => navigate('/cart')}>Go to Cart</button>
    </div>
  );
};

export default ViewClothes;
