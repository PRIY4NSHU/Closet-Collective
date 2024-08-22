// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../logo.png'

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className='navbar-container'>
      <div className='logo-container'>
          <Link to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>
      </div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/view-clothes">View Clothes</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/add-clothes">Add Clothes</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
    </header>
  );
};

export default Navbar;
