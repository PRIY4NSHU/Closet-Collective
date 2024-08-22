// src/pages/AddClothes.js
import React, { useState } from 'react';
import axios from 'axios';
// import './AddClothes.css'; // Import the CSS file

const AddClothes = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const { name, description, price, image } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/clothes', formData, config);
      console.log(res.data);
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        price: '',
        image: ''
      });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="add-clothes-container">
      <h1 className="add-clothes-title">Add New Clothes</h1>
      <form className="add-clothes-form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description"
            name="description"
            value={description}
            onChange={onChange}
            className="form-input"
            rows="3"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Price (per day)"
            name="price"
            value={price}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Image URL"
            name="image"
            value={image}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="add-clothes-button">Add Dress</button>
      </form>
    </div>
  );
};

export default AddClothes;
