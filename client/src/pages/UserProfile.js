// src/pages/UserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
// import './UserProfile.css'; // Import the CSS file
// import '../App.css';

const UserProfile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
      fetchBookings();
    }
  }, [isAuthenticated]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const renderBookingStatus = (booking) => {
    const now = new Date();
    if (new Date(booking.endDate) < now) {
      return 'Past Rental';
    } else if (new Date(booking.startDate) <= now && new Date(booking.endDate) >= now) {
      return 'Ongoing Rental';
    } else {
      return 'Upcoming Rental';
    }
  };

  return (
    <div className="user-profile-container">
      <h1 className="profile-title">User Profile</h1>
      <h2 className="welcome-message">Welcome, {user.name}</h2>
      <h3 className="bookings-title">Your Bookings</h3>

      <div className="bookings-table">
        <div className="table-header">
          {/* <div className="table-row"> */}
            <span className="table-cell header-cell">Order Id</span>
            <span className="table-cell header-cell">Product Name</span>
            <span className="table-cell header-cell">Start Date</span>
            <span className="table-cell header-cell">End Date</span>
            <span className="table-cell header-cell">Status</span>
          {/* </div> */}
        </div>

        <div className="table-body">
          {bookings.map((booking) => (
            <div className="table-row" key={booking._id}>
              <span className="table-cell">{booking._id}</span>
              <span className="table-cell">{booking.clothes.name}</span>
              <span className="table-cell">
                {new Date(booking.startDate).toLocaleDateString()}
              </span>
              <span className="table-cell">
                {new Date(booking.endDate).toLocaleDateString()}
              </span>
              <span className="table-cell">{renderBookingStatus(booking)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
