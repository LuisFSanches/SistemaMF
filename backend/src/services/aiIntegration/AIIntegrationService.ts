import OpenAI from "openai";
import { ErrorCodes } from "../../exceptions/root";

class AIIntegrationService {
    async execute(prompt: string, textContent: string) {
        try {
            const client = new OpenAI({
                apiKey: process.env.APP_OPENAI_API_KEY,
            });
            
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: textContent
                    }
                ],
                temperature: 0,
                response_format: { type: "json_object" }
            });

            const rawContent = response.choices[0].message.content as string;
            return JSON.parse(rawContent);
        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { AIIntegrationService }