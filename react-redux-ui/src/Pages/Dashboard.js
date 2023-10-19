import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useRef } from "react";
import { io } from "socket.io-client";

const orderUrl = process.env.REACT_APP_ORDER_URL;
const nodejsUrl = process.env.REACT_APP_NODEJS_URL;
const goUrl = process.env.REACT_APP_GO_URL;

const allOrderUrl = `${orderUrl}/all`;
const nodejsUpdateOrderUrl = `${nodejsUrl}/all`;
const goUpdateOrderUrl = `${goUrl}/all`;


function Dashboard() {
  const socket = useRef();
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);

  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
  useEffect(() => {
    socket.current = io(`ws://${nodejsUrl}`);
    socket.current.on("connection", () => {
      console.log("Connected to server");
    });
    // Add a listener for the "message" event
    socket.current.on("message", (message) => {
      console.log("Received message from server:", message);
    });

    // Make a GET request to fetch orders when the component mounts
    axios.get(allOrderUrl)
      .then((response) => {
        setOrders(response.data); // Set the orders in the component state
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
  useEffect(() => {
    // Make a GET request to fetch orders when the component mounts
    axios.get(allOrderUrl)
      .then((response) => {
        setOrders(response.data); // Set the orders in the component state
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);
  const nodeHandleUpdateOrder = (orderId) => {
    // Send a POST request to update the order
    axios.post(`${nodejsUpdateOrderUrl}/${orderId}`)
      .then(() => {
        // Update the UI or perform any other actions after the order is updated
        // You can fetch the updated orders again if needed
      })
      .catch((error) => {
        console.error('Error updating order:', error);
      });
  };
  const goHandleUpdateOrder = (orderId) => {
    // Send a POST request to update the order
    axios.post(`${goUpdateOrderUrl}/${orderId}`)
      .then(() => {
        // Update the UI or perform any other actions after the order is updated
        // You can fetch the updated orders again if needed
      })
      .catch((error) => {
        console.error('Error updating order:', error);
      });
  };


  return (
    <div>
      <h2>Welcome to the Dashboard, {user ? user.email : 'User'}!</h2>
      <h3>Your Orders:</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order ID: {order.id}<br />
            Order Name: {order.name}<br />
            Quantity: {order.quantity}<br />
            Order Status: {order.is_open ? 'Open' : 'Closed'}
            {order.is_open && (
              <div>
                <button onClick={() => nodeHandleUpdateOrder(order.id)}>
                  Update Order (Node.js Microservice)
                </button>
                <button onClick={() => goHandleUpdateOrder(order.id)}>
                  Update Order (Go Microservice)
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;


