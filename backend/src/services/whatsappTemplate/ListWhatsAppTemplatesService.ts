import prismaClient from "../../prisma";

export class ListWhatsAppTemplatesService {
    async execute() {
        try {
            const templates = await prismaClient.whatsAppTemplate.findMany({
                orderBy: { created_at: "desc" },
            });

            return { templates };
        } catch (error: any) {
            console.error("[ListWhatsAppTemplatesService] Failed to list templates:", error);
            throw error;
        }
    }
}
