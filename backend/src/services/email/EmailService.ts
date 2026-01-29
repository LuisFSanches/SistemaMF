import nodemailer from 'nodemailer';

interface ISendEmail {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configuração OAuth2 usando as credenciais do Gmail já existentes
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

    async sendEmail({ to, subject, html }: ISendEmail) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Sistema MF" <${process.env.GMAIL_ACC}>`,
                to,
                subject,
                html,
            });

            console.log('[EmailService] Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error: any) {
            console.error('[EmailService] Failed to send email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendPasswordResetEmail(email: string, resetToken: string, adminName: string) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #EC4899; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #EC4899; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Redefinição de Senha</h1>
                    </div>
                    <div class="content">
                        <p>Olá, <strong>${adminName}</strong>!</p>
                        
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                        
                        <p>Para criar uma nova senha, clique no botão abaixo:</p>
                        
                        <div style="text-align: center;">
                            <a style="background-color: #EC4899; color: white; text-decoration: none;" href="${resetUrl}" class="button">Redefinir Senha</a>
                        </div>
                        
                        <p>Ou copie e cole o link abaixo no seu navegador:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        
                        <div class="warning">
                            <strong>⚠️ Importante:</strong>
                            <ul>
                                <li>Este link expira em <strong>1 hora</strong></li>
                                <li>Se você não solicitou esta alteração, ignore este email</li>
                                <li>Sua senha atual permanecerá inalterada</li>
                            </ul>
                        </div>
                        
                        <p>Por segurança, nunca compartilhe este link com ninguém.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Sistema MF. Todos os direitos reservados.</p>
                        <p>Este é um email automático, por favor não responda.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return this.sendEmail({
            to: email,
            subject: 'Redefinição de Senha - Sistema MF',
            html,
        });
    }
}

export { EmailService };
