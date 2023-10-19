import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Store/userSlice';
import { useSelector } from 'react-redux';

import { useRef } from "react";
import { io } from "socket.io-client";

function Login() {
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:5003");

    socket.current.on("connection", () => {
      console.log("Connected to server");
    });

    // Add a listener for the "message" event
    socket.current.on("message", (message) => {
      console.log("Received message from server:", message);
    });
  }, []);
  //socket.current.emit("message", new Date().getTime());

  const { loading, user, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for displaying the message

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async () => { // Mark the function as async
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await dispatch(loginUser(data)); // Dispatch the loginUser action and await its completion

      if (response.payload.user) {
        setMessage('Login succeeded'); // Display success message
        navigate('/dashboard');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred while trying to log in.'); // Handle any error from the loginUser action
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <div>{message}</div>} {/* Display message if it exists */}
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>
          {loading ? 'loading...' : 'Login'}
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
}

export default Login;


