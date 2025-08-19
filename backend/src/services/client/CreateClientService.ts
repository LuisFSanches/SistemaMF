import { IClient } from "../../interfaces/IClient";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { createClientSchema } from "../../schemas/client/createClient";

class CreateClientService{
    async execute(data: IClient) {
        const parsed = createClientSchema.safeParse(data);
        if (!parsed.success) {
            return {
                error: true,
                message: parsed.error.errors[0].message,
                code: ErrorCodes.VALIDATION_ERROR
            };
        }
        
        const { phone_number } = data;
        try {
            const client = await prismaClient.client.findFirst({
                where: {
                    phone_number
                }
            })

            if (client) {
                return { error: true, message: 'Client already created', code: ErrorCodes.USER_ALREADY_EXISTS }
            }

            const newClient = await prismaClient.client.create({
                data
            })

            return newClient;

        } catch(error: any) {
            console.log('data', data)
            console.log("[FinishOnlineOrderController] Failed to create client on order finalization", error.message);

            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { CreateClientService }
