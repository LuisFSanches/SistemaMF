import { Request, Response } from 'express';
import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

class WebhookPixController {
    async handle(req: Request, res: Response) {
        console.log('AQUII')
        try {
            console.log('Notificação Pix recebida:', req.body);
            const notification = req.body;
            eventEmitter.emit("pixReceived", notification);

            return res.json(notification);
        } catch (error) {
            console.error('Erro ao processar notificação Pix:', error);
            return res.status(500).send('Erro ao processar notificação');
        }
    }
}

export { WebhookPixController, eventEmitter };
