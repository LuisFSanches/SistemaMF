import { CreateClientService } from "../services/client/CreateClientService";
import { GetClientByPhoneNumberService } from "../services/client/GetClientByPhoneNumberService";
import { CreateAddressService } from "../services/address/CreateAddressService";
import { GetAllClientAddressService } from "../services/address/GetAllClientAddressService";
import { GetAddressByStreetAndNumberService } from "../services/address/GetAddressByStreetAndNumberService";
import { CreateOrderService } from "../services/order/CreateOrderService";

class OrderFacade {
    private createClientService: CreateClientService;
    private getClientByPhoneService: GetClientByPhoneNumberService;
    private createAddressService: CreateAddressService;
    private getClientAddressService: GetAllClientAddressService;
    private getAddressByStreetAndNumberService: GetAddressByStreetAndNumberService;
    private createOrderService: CreateOrderService;

    constructor(
        createClientService: CreateClientService,
        getClientByPhoneService: GetClientByPhoneNumberService,
        createAddressService: CreateAddressService,
        getClientAddressService: GetAllClientAddressService,
        getAddressByStreetAndNumberService: GetAddressByStreetAndNumberService,
        createOrderService: CreateOrderService
    ) {
        this.createClientService = createClientService;
        this.getClientByPhoneService = getClientByPhoneService;
        this.createAddressService = createAddressService;
        this.getClientAddressService = getClientAddressService;
        this.getAddressByStreetAndNumberService = getAddressByStreetAndNumberService;
        this.createOrderService = createOrderService;
    }

    async createOrder(data: any) {
        let client_id = data.clientId;
        let address_id = data.addressId;

        if (!client_id && (data.phone_number && data.phone_number !== "")) {
            const existingClient = await this.getClientByPhoneService.execute(
                data.phone_number
            ) as any;

            if (existingClient?.id) {
                client_id = existingClient.id;
            } else {
                const client = await this.createClientService.execute({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone_number: data.phone_number,
                });
                client_id = client.id;
            }
        }

        if (data.is_delivery) {
            if (!address_id && data?.street && data.street_number) {
                const existingAddress = await this.getAddressByStreetAndNumberService.execute(
                    client_id,
                    data.street,
                    data.street_number
                ) as any;

                if (existingAddress?.id) {
                    address_id = existingAddress.id;
                } else {
                    const address = await this.createAddressService.execute({
                        client_id,
                        street: data.street,
                        street_number: data.street_number,
                        complement: data.complement,
                        reference_point: data.reference_point,
                        neighborhood: data.neighborhood,
                        city: data.city,
                        state: data.state,
                        postal_code: data.postal_code,
                        country: data.country
                    });
                    address_id = address.id;
                }
            }
        }

        if (!data.is_delivery) {
            const defaultUser = await this.getClientByPhoneService.execute("22997517940") as any;
            if (!client_id) {
                client_id = defaultUser.id
            }

            const addresses = await this.getClientAddressService.execute(defaultUser.id) as any;
            address_id = addresses[0]?.id;
        }

        const order = await this.createOrderService.execute(
            {
                description: data.description,
                additional_information: data.additional_information,
                client_id,
                client_address_id: address_id,
                pickup_on_store: data.pickup_on_store,
                receiver_name: data.receiver_name,
                receiver_phone: data.receiver_phone,
                products_value: data.products_value,
                delivery_fee: data.delivery_fee,
                discount: data.discount || 0,
                total: data.total,
                payment_method: data.payment_method,
                payment_received: data.payment_received,
                delivery_date: data.delivery_date,
                created_by: data.created_by,
                updated_by: data.created_by,
                status: data.status,
                has_card: data.has_card,
                card_from: data.card_from,
                card_to: data.card_to,
                card_message: data.card_message,
                online_order: data.online_order,
                online_code: data.online_code,
                is_delivery: data.is_delivery
            },
            data.products
        );

        return order;
    }
}

export { OrderFacade };
