import React, { useState } from 'react';
import { login } from './services/api';
import Dashboard from './pages/Dashboard';
import { jwtDecode } from 'jwt-decode';

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

  return <Dashboard token={token} role={role} onLogout={() => { setToken(null); setRole(null); }} />;
}

export default App;
