import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import CreateOrder from './Pages/CreateOrder';
import store from './Store/store';

//axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createorder" element={<CreateOrder />} />


        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
