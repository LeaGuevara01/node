/**
 * App (SPA root)
 * Rol: router + gate de autenticación
 * Notas: token JWT en estado local; NavigationProvider para navegación avanzada
 * 
 * ACTUALIZADO PARA USAR NAVEGACIÓN REFACTORIZADA
 * Fecha: 2025-08-07T04:19:54.386Z
 * 
 * Cambios:
 * - Dashboard → DashboardRefactored
 * - MaquinariasPage → MaquinariasPageRefactored
 * - MaquinariaDetails → MaquinariaDetailsRefactored
 */

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { login } from './services/api';
import { NavigationProvider } from './contexts/NavigationContext';
import Dashboard from './pages/DashboardRefactored';
import MaquinariaDetails from './pages/MaquinariaDetailsRefactored';
import MaquinariasPage from './pages/MaquinariasPageRefactored';
import MaquinariaFormulario from './pages/MaquinariaFormulario';
import RepuestosPage from './pages/RepuestosPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ReparacionesPage from './pages/ReparacionesPage';
import UsuariosPage from './pages/UsuariosPage';
import ComprasPage from './pages/ComprasPage';
import CompraForm from './pages/CompraForm';
import CompraDetails from './pages/CompraDetails';
import RepuestoDetails from './pages/RepuestoDetails';
import ReparacionDetails from './pages/ReparacionDetails';
import ProveedorDetails from './pages/ProveedorDetails';
import { jwtDecode } from 'jwt-decode';
import ContextPlaceholder from './pages/ContextPlaceholder';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(username, password);
      if (res.token) {
        setToken(res.token);
        const decoded = jwtDecode(res.token);
        setRole(decoded.role);
        setError('');
      } else {
        setError(res.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-xl mb-4">Iniciar sesión</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mb-2 p-2 w-full border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-2 p-2 w-full border rounded"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Entrar</button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <NavigationProvider>
      <Routes>
  <Route path="/" element={<Dashboard token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
  {/* Alias explícito para permitir /dashboard */}
  <Route path="/dashboard" element={<Dashboard token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
        
        {/* Páginas de listado con filtros avanzados */}
        <Route path="/maquinarias" element={<MaquinariasPage token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
        <Route path="/repuestos" element={<RepuestosPage token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
        <Route path="/proveedores" element={<ProveedoresPage token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
        <Route path="/reparaciones" element={<ReparacionesPage token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
        <Route path="/usuarios" element={<UsuariosPage token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
  <Route path="/compras" element={<ComprasPage token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
  <Route path="/compras/nueva" element={<CompraForm token={token} />} />
        <Route path="/compras/:id" element={<CompraDetails token={token} />} />
        
        {/* Formularios y páginas de detalles */}
        <Route path="/maquinarias/formulario" element={<MaquinariaFormulario token={token} />} />
        <Route path="/maquinarias/editar/:id" element={<MaquinariaFormulario token={token} />} />
        <Route path="/maquinarias/:id" element={<MaquinariaDetails token={token} />} />
        <Route path="/repuestos/:id" element={<RepuestoDetails token={token} />} />
        <Route path="/reparaciones/:id" element={<ReparacionDetails token={token} />} />
        <Route path="/proveedores/:id" element={<ProveedorDetails token={token} />} />
  {/* Rutas de contexto (placeholder) */}
  <Route path="/contexto/:tipo/:valor" element={<ContextPlaceholder token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
}

export default App;
