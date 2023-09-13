import React from 'react';
import './App.css';
import AppRouter from './AppRouter'; // Importe o componente AppRouter

function App() {
  return (
    <div className="App">
      <AppRouter /> {/* Renderiza o componente AppRouter que gerencia as rotas */}
    </div>
  );
}

export default App;
