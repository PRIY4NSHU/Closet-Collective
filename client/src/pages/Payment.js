// src/pages/Payment.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { state } = useLocation();
  const { totalAmount, bookingDetails } = state || {};
  const [enteredAmount, setEnteredAmount] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (parseFloat(enteredAmount) === totalAmount) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:5000/api/bookings/confirm',
          { bookingDetails },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Payment successful! Your clothes have been booked.');
        navigate('/confirmation'); // Redirect to the user's profile page
      } catch (err) {
        console.error(err);
        alert('Error processing payment');
      }
    } else {
      alert('Entered amount does not match the total amount. Please try again.');
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <h4>(This is not an actual payment gateway. Just Enter the payment amount and click on "Confirm Payment". </h4>
      <h4>Will add an actual payment gateway in future updates)</h4>
      <p>Total Amount: ₹ {totalAmount}</p>
      <input
        type="number"
        placeholder="Enter payment amount"
        value={enteredAmount}
        onChange={(e) => setEnteredAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Confirm Payment</button>
    </div>
  );
};

export default Payment;
