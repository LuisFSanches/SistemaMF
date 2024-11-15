import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { OrdersProvider } from './contexts/OrdersContext';

import Routes from "./routes";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ClientsProvider>
        <OrdersProvider>
          <Routes/>
        </OrdersProvider>
      </ClientsProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
