import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../Store/userSlice';
import { useSelector } from 'react-redux';


function Register() {

  const { loading, user, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for displaying the message

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleRegister = async () => { // Mark the function as async
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await dispatch(registerUser(data)); // Dispatch the loginUser action and await its completion

      if (response.payload.user) {
        setMessage('Register succeeded'); // Display success message
        navigate('/dashboard');
      } else {
        setMessage('Register failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred while trying to registertion.'); // Handle any error from the loginUser action
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
        <button type="button" onClick={handleRegister}>
          {loading ? 'loading...' : 'Register'}
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
}

export default Register;



