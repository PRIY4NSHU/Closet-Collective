// src/App.js secrets, Goutam, Guilt year, Guilt subside, Truths uncovered, Liking, Hurt, Confront?, Riddhi, Confidence, Anyways.
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AddClothes from './pages/AddClothes';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import ViewClothes from './pages/ViewClothes';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/view-clothes" element={<ViewClothes />} />
        <Route element={<PrivateRoute />}>
          <Route path="/add-clothes" element={<AddClothes />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
