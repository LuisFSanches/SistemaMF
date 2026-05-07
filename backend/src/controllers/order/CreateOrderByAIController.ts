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
    - Nunca invente informações que não estejam no texto.
    - Identifique padrões brasileiros (telefone, endereço, nomes).
    - O endereço pode vir em uma única linha (ex: "Rua X 123, Bairro Y").
    - "Ponto de referência" geralmente é algo como: perto de, em frente a, ao lado de.
    - Telefones devem conter apenas números.
    - Se houver múltiplos nomes, o primeiro é o remetente, o segundo é o destinatário (se fizer sentido).
    - Mensagens curtas como "isso mesmo", "ok" devem ser ignoradas.
    - Se detectar apenas um telefone, considere como do remetente.

    ⚠️ CAMPOS QUE NUNCA PODEM SER NULL OU VAZIO:
    
    1. first_name (string): 
        - Se encontrar nome completo, use só o primeiro nome
        - Se não encontrar, pegue o primeiro nome de card_from
        - Se ainda não tiver, use "Cliente"
        - NUNCA retorne null!
    
    2. last_name (string):
        - Se encontrar nome completo, use os sobrenomes
        - Se só tiver primeiro nome, use "Não informado"
        - Se não encontrar nenhum nome, use "Não informado"
        - NUNCA retorne null ou string vazia!
        - Exemplos válidos: "Silva", "Não informado", "Santos"
    
    3. phone_number (string): 
        - OBRIGATÓRIO - deve ter pelo menos um telefone no texto
        - Apenas números, sem espaços ou caracteres
        - NUNCA retorne null!
    
    4. street (string): 
        - Se não informado mas for entrega, use "Rua não informada"
        - NUNCA retorne null!
    
    5. street_number (string): 
        - Se não informado mas for entrega, use "S/N"
        - NUNCA retorne null!
    
    6. neighborhood (string): 
        - Se não informado mas for entrega, use "Centro"
        - NUNCA retorne null!
    
    7. city (string): 
        - Se não informado, use "Itaperuna"
        - NUNCA retorne null!
    
    8. postal_code (string): 
        - Se não informado, use "28300000"
        - NUNCA retorne null!

    CAMPOS OPCIONAIS (pode retornar null se não encontrar):
    - delivery_date, card_from, receiver_name, receiver_phone, card_to, 
      reference_point, card_message

    CAMPOS BOOLEANOS (NUNCA null):
    - is_delivery: true se mencionar entrega/endereço, false se mencionar retirada
    - pickup_on_store: inverso de is_delivery
    - has_card: true se houver mensagem de cartão

    RETORNE APENAS JSON VÁLIDO com estes campos:
    {
        "delivery_date": "DD-MM" ou null,
        "card_from": "string" ou null,
        "first_name": "string NUNCA null",
        "last_name": "string NUNCA null (use 'Não informado' se não souber)",
        "phone_number": "string NUNCA null",
        "receiver_name": "string" ou null,
        "receiver_phone": "string" ou null,
        "card_to": "string" ou null,
        "street": "string NUNCA null (use 'Rua não informada' se não souber)",
        "neighborhood": "string NUNCA null (use 'Centro' se não souber)",
        "street_number": "string NUNCA null (use 'S/N' se não souber)",
        "reference_point": "string" ou null,
        "city": "string NUNCA null (use 'Itaperuna' se não souber)",
        "postal_code": "string NUNCA null (use '28300000' se não souber)",
        "card_message": "string" ou null,
        "is_delivery": boolean NUNCA null,
        "pickup_on_store": boolean NUNCA null,
        "has_card": boolean NUNCA null
    }
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