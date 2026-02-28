import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SucursalProvider } from './contexts/SucursalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SucursalProvider>
        <App />
      </SucursalProvider>
    </AuthProvider>
  </React.StrictMode>
);
