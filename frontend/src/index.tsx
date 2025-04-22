import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { OrdersProvider } from './contexts/OrdersContext';

import Routes from "./routes";
import { AdminsProvider } from './contexts/AdminsContext';
import { ProductsProvider } from './contexts/ProductsContext';

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<AdminsProvider>
				<ClientsProvider>
					<OrdersProvider>
						<ProductsProvider>
							<Routes/>
						</ProductsProvider>
					</OrdersProvider>
				</ClientsProvider>
			</AdminsProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
