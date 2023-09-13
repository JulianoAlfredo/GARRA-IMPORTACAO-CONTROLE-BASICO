import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddProduct from './AddProduct';
import AddUser from './AddUser';
import UserProducts from './UserProducts';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/user-products/:userId" element={<UserProducts />} />
    </Routes>
  </Router>
);

export default AppRouter;
