import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MaquinariaForm from './pages/MaquinariaForm';
import AuthContext from './authContext';

const App = () => {
  const { token, logout } = React.useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard token={token} role="User" onLogout={logout} />} />
        <Route path="/maquinaria" element={<MaquinariaForm token={token} onCreated={() => {}} />} />
        {/* Agregar más rutas según sea necesario */}
      </Routes>
    </Router>
  );
};

export default App;
