import prismaClient from "../../prisma";
import { createSpecialDateSchema } from "../../schemas/specialDate/createSpecialDateSchema";

interface ICreateSpecialDateData {
    store_id?: string | null;
    name: string;
    date: Date;
}

export class CreateSpecialDateService {
    async execute(data: ICreateSpecialDateData) {
        try {
            const validatedData = createSpecialDateSchema.parse(data);

            const specialDate = await prismaClient.specialDate.create({
                data: validatedData,
            });

            return specialDate;
        } catch (error: any) {
            console.error("[CreateSpecialDateService] Failed to create special date:", error);
            throw error;
        }
    }
}
