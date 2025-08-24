import {Request, Response, NextFunction} from 'express';
import { GetClientByPhoneNumberService } from '../../services/client/GetClientByPhoneNumberService'
import { CreateClientService } from '../../services/client/CreateClientService';
import { CreateOrderService } from '../../services/order/CreateOrderService'
import { GetAddressByStreetAndNumberService } from '../../services/address/GetAddressByStreetAndNumberService';
import { GetAllClientAddressService } from '../../services/address/GetAllClientAddressService';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { AIIntegrationService } from '../../services/aiIntegration/AIIntegrationService';

import { adjustDeliveryDate } from '../../utils/adjustDeliveryDate';

import { ErrorCodes } from "../../exceptions/root";

const prompt = `
    Você é um assistente que extrai informações de pedidos de flores.
    Sempre retorne JSON válido com os campos:
    - delivery_date (format DD-MM)
    - card_from (client sender name)
    - first_name (client sender name)
    - last_name (client sender name, if empty send --)
    - phone_number (client sender phone, just the numbers no spaces)
    - receiver_name (receiver name, if not present return null)
    - receiver_phone (just the numbers no spaces, if not present return null)
    - card_to (receiver name, if not present return null)
    - street
    - neighborhood
    - street_number
    - reference
    - city (default Itaperuna)
    - postal_code (default 28300000)
    - card_message
    - is_delivery (boolean - check if has address)
    - pickup_on_store (boolean - check if pick up)
    - has_card (boolean - check if has card)
`

class CreateOrderByAIController {
    handle = async (req: Request, res: Response, next: NextFunction) => {
        const {
            description,
            additional_information,
            payment_method,
            payment_received,
            products_value,
            delivery_fee,
            total,
            products,
            online_order,
            online_code,
            order_ai_information,
            created_by,
        } = req.body;
        const status = "OPENED";

        try {
            const aiIntegration = new AIIntegrationService();
            const content = await aiIntegration.execute(
                prompt,
                order_ai_information
            )

            const phone_number = content["phone_number"];
            const getClientService = new GetClientByPhoneNumberService();
            const getClient = await getClientService.execute(phone_number) as any;
            let client_id = getClient ? getClient.id : "";
            let address_id = "" as any;

            if (!getClient) {
                const client = await new CreateClientService().execute({
                    first_name: content["first_name"],
                    last_name: content["last_name"],
                    phone_number
                });

                if ('id' in client) {
                    client_id = client.id;
                }
            }

            if (content["is_delivery"]) {
                const getAddressService = new GetAddressByStreetAndNumberService();
                const getAddress = await getAddressService.execute(
                    client_id,
                    content["street"],
                    content["street_number"],
                ) as any;

                if (getAddress && 'id' in getAddress) {
                    address_id = getAddress.id;
                } else {
                    const address = await new CreateAddressService().execute({
                        client_id,
                        street: content["street"],
                        street_number: content["street_number"],
                        neighborhood: content["neighborhood"],
                        reference_point: content["reference"],
                        complement: "",
                        city: content["city"],
                        state: "RJ",
                        postal_code: content["postal_code"],
                        country: "Brasil",
                    });

                    if ('id' in address) {
                        address_id = address.id;
                    }
                }
            }

            if (!content["is_delivery"]) {
                const defaultUserId = await this.getDefaultUserId();
                if (!client_id) {
                    client_id = defaultUserId;
                }
                const getClientAddressService = new GetAllClientAddressService();
                let address = await getClientAddressService.execute(defaultUserId) as any;
                address_id = address[0]?.id;
            }

            const delivery_date = adjustDeliveryDate(content["delivery_date"]);
            const data = {
                description,
                additional_information,
                payment_method,
                payment_received,
                products_value,
                delivery_fee,
                total,
                client_id,
                client_address_id: address_id,
                pickup_on_store: content["pickup_on_store"],
                receiver_name: content["receiver_name"],
                receiver_phone: content["receiver_phone"],
                delivery_date,
                online_order,
                online_code,
                status,
                has_card: content["has_card"],
                card_from: content["card_from"],
                card_to: content["card_to"],
                card_message: content["card_message"],
                is_delivery: content["is_delivery"],
                created_by,
                updated_by: created_by,
            }

            const createOrderService = new CreateOrderService();
            const order = await createOrderService.execute(data,products);
            return res.json(order);
        } catch (error: any) {
            console.log('Failed when creating order via AI', error.message)
            return res.status(400).json({ error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR })
        }
    }

    /*
	* Get default user
	* @returns {string}
	*/
	async getDefaultUserId(): Promise<string> {
		const storePhoneNumber = "22997517940";
		const getClientService = new GetClientByPhoneNumberService();
		const getClient = await getClientService.execute(storePhoneNumber) as any;
		
		return getClient.id
	}
}

export { CreateOrderByAIController }