import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './authContext';
import { NavigationProvider } from './contexts/NavigationContext';

// Páginas principales (JS/JSX importables en TS gracias a allowJs)
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
import ContextPlaceholder from './pages/ContextPlaceholder';

const App: React.FC = () => {
  const { token, logout } = React.useContext(AuthContext);
  // Derivar rol desde el token si está presente
  let role: string | null = null;
  try {
    if (token) {
      const decoded: any = jwtDecode(token);
      role = decoded?.role || null;
    }
  } catch {
    role = null;
  }

  const onLogout = () => logout();

  return (
    <NavigationProvider>
      <Routes>
        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard token={token as any} role={role as any} onLogout={onLogout} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard token={token as any} role={role as any} onLogout={onLogout} />}
        />

        {/* Listados */}
        <Route
          path="/maquinarias"
          element={<MaquinariasPage token={token as any} role={role as any} onLogout={onLogout} />}
        />
        <Route
          path="/repuestos"
          element={
            <RepuestosPage
              token={token as any}
              role={role as any}
              onLogout={onLogout}
              onCreated={() => {}}
            />
          }
        />
        <Route
          path="/proveedores"
          element={
            <ProveedoresPage
              token={token as any}
              role={role as any}
              onLogout={onLogout}
              onCreated={() => {}}
            />
          }
        />
        <Route
          path="/reparaciones"
          element={
            <ReparacionesPage
              token={token as any}
              role={role as any}
              onLogout={onLogout}
              onCreated={() => {}}
            />
          }
        />
        <Route
          path="/usuarios"
          element={
            <UsuariosPage
              token={token as any}
              role={role as any}
              onLogout={onLogout}
              onCreated={() => {}}
            />
          }
        />
        <Route
          path="/compras"
          element={<ComprasPage token={token as any} role={role as any} onLogout={onLogout} />}
        />

        {/* Formularios y detalles */}
        <Route path="/compras/nueva" element={<CompraForm token={token as any} />} />
        <Route path="/compras/:id" element={<CompraDetails token={token as any} />} />
        <Route
          path="/maquinarias/formulario"
          element={<MaquinariaFormulario token={token as any} onCreated={() => {}} />}
        />
        <Route
          path="/maquinarias/editar/:id"
          element={<MaquinariaFormulario token={token as any} onCreated={() => {}} />}
        />
        <Route path="/maquinarias/:id" element={<MaquinariaDetails token={token as any} />} />
        <Route path="/repuestos/:id" element={<RepuestoDetails token={token as any} />} />
        <Route path="/reparaciones/:id" element={<ReparacionDetails token={token as any} />} />
        <Route path="/proveedores/:id" element={<ProveedorDetails token={token as any} />} />
        <Route
          path="/contexto/:tipo/:valor"
          element={
            <ContextPlaceholder token={token as any} role={role as any} onLogout={onLogout} />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
};

export default App;
