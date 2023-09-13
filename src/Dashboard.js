import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <Link to="/add-product">Adicionar Produto</Link>
    <Link to="/add-user">Adicionar Usuário</Link>
  </div>
);

export default Dashboard;
