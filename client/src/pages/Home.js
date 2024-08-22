import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Create a separate CSS file for styling
import logo from '../logo.png';
import pic1 from '../pic_formal.png';
import pic2 from '../pic_shraddha.jpg';
import pic3 from '../pic_trad.jpg';

const Home = () => {
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    const fetchClothes = async () => {
      const res = await axios.get('http://localhost:5000/api/clothes');
      setClothes(res.data);
    };
    fetchClothes();
  }, []);

  return (
    <div className='home-bg'>
      <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <img src={logo} alt=''></img>
          <p>The ultimate clothes rental destination</p>
      </div>
      </section>
      </div>
      <div className='autoshow-r'>
        <div className='cart-item-card'>
          <div className='hero-content'>
            <h1>Your Closet, Reimagined</h1>
            <p>From Traditional to Formals, From Classics to Trends</p>
          </div>
          <img src={pic1} className='home-img' alt=''></img>
        </div>
      </div>
      <div className='autoshow-l'>
        <div className='cart-item-card'>
          <div>
            <img src={pic2} className='home-img' alt=''></img>
          </div>
          <div className='hero-content'>
            <h1>Elevate Your Style</h1>
            <p>Explore our festive collection and make every occasion special.</p>
          </div>
        </div>
      </div>
      <div className='autoshow-r'>
        <div className='cart-item-card'>
          <div className='hero-content'>
            <h1>Rent, Wear, Return, Repeat</h1>
            <p>Explore our festive collection and make every occasion special.</p>
          </div>
          <img src={pic3} className='home-img' alt=''></img>
        </div>
      </div>
      <section className="featured-collections">
       <h2>Discover Our Featured Finds</h2>
        <div className="collections-grid">
          {clothes.slice(4, 8).map(cloth => (
            <div className='autoshow'>
              <div className="collection-card" key={cloth._id}>
                <img src={cloth.image} alt={cloth.name} className="collection-image" />
                <h3>{cloth.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 PRIY4NSHU. All rights reserved.</p>
          <div className="social-icons">
            {/* Add social media icons here */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
