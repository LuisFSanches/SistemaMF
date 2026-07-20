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
import { DeliveryMenProvider } from './contexts/DeliveryMenContext';
import { SuppliersProvider } from './contexts/SuppliersContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
// import { SubscriptionProvider } from './contexts/SubscriptionContext';

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<AdminsProvider>
				<ClientsProvider>
					<OrdersProvider>
						<OrdersToReceiveProvider>
							<OrderDeliveriesProvider>
								<DeliveryMenProvider>
									<SuppliersProvider>
										<ProductsProvider>
											<CategoriesProvider>
												{/* <SubscriptionProvider> */}
													<SuccessMessageProvider>
														<Routes/>
													</SuccessMessageProvider>
												{/* </SubscriptionProvider> */}
											</CategoriesProvider>
										</ProductsProvider>
									</SuppliersProvider>
								</DeliveryMenProvider>
							</OrderDeliveriesProvider>
						</OrdersToReceiveProvider>
					</OrdersProvider>
				</ClientsProvider>
			</AdminsProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
