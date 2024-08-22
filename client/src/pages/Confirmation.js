// src/pages/Confirmation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Confirmation = () => {
  return (
    <div>
      <h1>Booking Confirmed</h1>
      <p>Your booking has been successfully completed. Thank you for your payment!</p>
      <Link to="/view-clothes">Back to Clothes</Link>
    </div>
  );
};

export default Confirmation;
