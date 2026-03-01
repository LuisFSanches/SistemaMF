import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { OrdersProvider } from './contexts/OrdersContext';

import Routes from "./routes";
import { AdminsProvider } from './contexts/AdminsContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { SuccessMessageProvider } from './contexts/SuccessMessageContext';
import { OrdersToReceiveProvider } from './contexts/OrdersToReceiveContext';
import { OrderDeliveriesProvider } from './contexts/OrderDeliveriesContext';

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<AdminsProvider>
				<ClientsProvider>
					<OrdersProvider>
						<OrdersToReceiveProvider>
							<OrderDeliveriesProvider>
								<ProductsProvider>
								<SuccessMessageProvider>
									<Routes/>
								</SuccessMessageProvider>
								</ProductsProvider>
							</OrderDeliveriesProvider>
						</OrdersToReceiveProvider>
					</OrdersProvider>
				</ClientsProvider>
			</AdminsProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
