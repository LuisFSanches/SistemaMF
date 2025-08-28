import { IClient } from "../../interfaces/IClient";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createClientSchema } from "../../schemas/client/createClient";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateClientService {
    async execute(data: IClient) {
        const parsed = createClientSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const { phone_number } = data;

        const client = await prismaClient.client.findFirst({
            where: { phone_number },
        });

        if (client) {
            throw new BadRequestException(
                "Client already created",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const newClient = await prismaClient.client.create({ data });
            return newClient;
        } catch (error: any) {
            console.error("[CreateClientService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateClientService };
