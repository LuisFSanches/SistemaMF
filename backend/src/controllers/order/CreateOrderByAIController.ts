import {Request, Response, NextFunction} from 'express';
import { GetClientByPhoneNumberService } from '../../services/client/GetClientByPhoneNumberService'
import { CreateClientService } from '../../services/client/CreateClientService';
import { CreateOrderService } from '../../services/order/CreateOrderService'
import { GetAddressByStreetAndNumberService } from '../../services/address/GetAddressByStreetAndNumberService';
import { GetAllClientAddressService } from '../../services/address/GetAllClientAddressService';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { AIIntegrationService } from '../../services/aiIntegration/AIIntegrationService';
import { OrderFacade } from '../../facades/OrderFacade';
import { adjustDeliveryDate } from '../../utils/adjustDeliveryDate';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

const prompt = `
    Você é um assistente especialista em interpretar mensagens de WhatsApp para pedidos de flores.
    O cliente pode responder de forma desorganizada, fora de ordem ou em múltiplas mensagens.

    REGRAS IMPORTANTES:
    - Nunca invente informações.
    - Se um campo não for encontrado, retorne null.
    - Identifique padrões brasileiros (telefone, endereço, nomes).
    - O endereço pode vir em uma única linha (ex: "Rua X 123, Bairro Y").
    - "Ponto de referência" geralmente é algo como: perto de, em frente a, ao lado de.
    - Telefones devem conter apenas números.
    - Se houver múltiplos nomes, o primeiro é o remetente, o segundo é o destinatário (se fizer sentido).
    - Mensagens curtas como "isso mesmo", "ok" devem ser ignoradas.
    - Se detectar apenas um telefone, considere como do remetente.

    RETORNE APENAS JSON VÁLIDO.

    Campos:
    - delivery_date (DD-MM)
    - card_from
    - first_name
    - last_name
    - phone_number
    - receiver_name
    - receiver_phone
    - card_to
    - street
    - neighborhood
    - street_number
    - reference_point
    - city (default Itaperuna)
    - postal_code (default 28300000)
    - card_message
    - is_delivery
    - pickup_on_store
    - has_card
`

class CreateOrderByAIController {
    /**
	 * @var OrderFacade
	 */
	private orderFacade: OrderFacade;

    constructor(){
		this.orderFacade = new OrderFacade(
			new CreateClientService(),
			new GetClientByPhoneNumberService(),
			new CreateAddressService(),
			new GetAllClientAddressService(),
			new GetAddressByStreetAndNumberService(),
			new CreateOrderService()
		);
	}

    handle = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;
        const status = "OPENED";
        const store_id = data.store_id ?? req.admin?.store_id;

        try {
            const aiIntegration = new AIIntegrationService();
            const content = await aiIntegration.execute(
                prompt,
                data.order_ai_information
            )

            const delivery_date = content["delivery_date"] ? adjustDeliveryDate(content["delivery_date"]) : null;

            const orderData = {
                clientId: null,
                first_name: content["first_name"],
                last_name: content["last_name"],
                phone_number: content["phone_number"],
                receiver_name: content["receiver_name"],
                receiver_phone: content["receiver_phone"],
                addressId: null,
                street: content["street"],
                street_number: content["street_number"],
                neighborhood: content["neighborhood"],
                reference_point: content["reference_point"],
                city: content["city"],
                state: "RJ",
                postal_code: content["postal_code"],
                country: "Brasil",
                description: data.description,
                additional_information: data.additional_information,
                delivery_date,
                products_value: data.products_value,
                delivery_fee: data.delivery_fee,
                total: data.total,
                payment_method: data.payment_method,
                payment_received: data.payment_received,
                status,
                has_card: content["has_card"],
                card_from: content["card_from"],
                card_to: content["card_to"],
                card_message: content["card_message"],
                is_delivery: content["is_delivery"],
                created_by: data.created_by,
                online_order: true,
                store_front_order: false,
                products: data.products,
            }

            const order = await this.orderFacade.createOrder(orderData, store_id as string);
            return res.json(order);
        } catch (error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateOrderByAIController }