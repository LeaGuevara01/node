import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './authContext';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(
  // Nota: se quita StrictMode para evitar dobles montajes y peticiones duplicadas en dev
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
