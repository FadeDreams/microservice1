import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const orderUrl = process.env.REACT_APP_ORDER_URL;
const allOrderUrl = `${orderUrl}/add-coffee`;


function CreateOrder() {
  const [coffeeName, setCoffeeName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const createOrder = () => {
    // Prepare the data to send in the request
    const data = {
      name: coffeeName,
      quantity: quantity,
    };

    // Send a POST request to create an order
    axios.post(allOrderUrl, data)
      .then((response) => {
        // Handle the success case
        setMessage('Order created successfully');

        // Navigate to the dashboard page after creating the order
        navigate('/dashboard')
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        setMessage('Error creating the order');
      });
  };

  return (
    <div>
      <h2>Create Order</h2>
      <div>
        <label>Coffee ID:</label>
        <input
          type="text"
          value={coffeeName}
          onChange={(e) => setCoffeeName(e.target.value)}
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button onClick={createOrder}>Create Order</button>
      <Link to="/dashboard">Go to Dashboard</Link>
      {message && <div>{message}</div>}
    </div>
  );
}

export default CreateOrder;

