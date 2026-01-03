import nodemailer from 'nodemailer';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';
import { IEmail } from '../../interfaces/IEmail';

class SendEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configurar transportador com OAuth2
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_ACC,
                clientId: process.env.GMAIL_CLIENTID,
                clientSecret: process.env.SECRECT_KEY,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
            },
        });
    }

    async execute({ to, subject, html }: IEmail) {
        try {
            console.log('[SendEmailService] Sending email to:', to);

            const mailOptions = {
                from: `Sistema MF <${process.env.GMAIL_ACC}>`,
                to,
                subject,
                html,
            };

            const info = await this.transporter.sendMail(mailOptions);

            console.log('[SendEmailService] Email sent successfully:', info.messageId);

            return {
                success: true,
                messageId: info.messageId,
                message: 'Email sent successfully',
            };
        } catch (error: any) {
            console.error('[SendEmailService] Failed to send email:', error);

            throw new BadRequestException(
                `Failed to send email: ${error.message}`,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { SendEmailService };
