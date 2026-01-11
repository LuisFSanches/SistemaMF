import { SendEmailService } from './SendEmailService';
import { IWelcomeEmail } from '../../interfaces/IEmail';

class SendWelcomeEmailService {
    async execute({ storeName, storeEmail, username, temporaryPassword }: IWelcomeEmail) {
        const sendEmailService = new SendEmailService();

        const subject = `Bem-vindo ao Sistema MF - ${storeName}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, rgba(244, 211, 224, 0.8), rgba(232, 223, 244, 1));
                        color: #3E3E3E;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .credentials-box {
                        background: white;
                        border-left: 4px solid #667eea;
                        padding: 20px;
                        margin: 20px 0;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .credential-item {
                        margin: 10px 0;
                        padding: 10px;
                        background: #f5f5f5;
                        border-radius: 5px;
                    }
                    .credential-label {
                        font-weight: bold;
                        color: #EC4899;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .credential-value {
                        font-size: 18px;
                        font-family: 'Courier New', monospace;
                        color: #333;
                        background: white;
                        padding: 8px;
                        border-radius: 3px;
                        border: 1px solid #ddd;
                    }
                    .warning {
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 30px;
                        background: #EC4899;
                        color: white !important;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                        font-size: 14px;
                    }
                    ul {
                        padding-left: 20px;
                    }
                    li {
                        margin: 8px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌸 Bem-vindo ao Sistema MF!</h1>
                    <p>Sua loja foi criada com sucesso</p>
                </div>
                
                <div class="content">
                    <p>Olá, <strong>${storeName}</strong>!</p>
                    
                    <p>Sua loja foi cadastrada com sucesso no Sistema MF. Abaixo estão suas credenciais de acesso ao painel administrativo:</p>
                    
                    <div class="credentials-box">
                        <h3 style="margin-top: 0; color: #667eea;">🔐 Credenciais de Acesso</h3>
                        
                        <div class="credential-item">
                            <span class="credential-label">Usuário:</span>
                            <div class="credential-value">${username}</div>
                        </div>
                        
                        <div class="credential-item">
                            <span class="credential-label">Senha Temporária:</span>
                            <div class="credential-value">${temporaryPassword}</div>
                        </div>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Importante:</strong>
                        <ul>
                            <li>Esta é uma <strong>senha temporária</strong></li>
                            <li>Você será solicitado a alterar a senha no primeiro acesso</li>
                            <li>Não compartilhe estas credenciais com terceiros</li>
                            <li>Guarde esta senha em um local seguro até realizar o primeiro acesso</li>
                        </ul>
                    </div>
                    
                    <center>
                        <a href="${process.env.BACKEND_URL || 'http://localhost:3334'}" class="button">
                            Acessar Sistema
                        </a>
                    </center>
                    
                    <h3 style="color: #EC4899;">📋 Próximos Passos:</h3>
                    <ol>
                        <li>Acesse o sistema usando as credenciais acima</li>
                        <li>Altere sua senha para uma senha segura e pessoal</li>
                        <li>Complete o cadastro da sua loja (logo, banner, endereço)</li>
                        <li>Configure as formas de pagamento (se aplicável)</li>
                        <li>Comece a cadastrar seus produtos</li>
                    </ol>
                    
                    <p>Se você tiver alguma dúvida ou precisar de ajuda, entre em contato conosco.</p>
                    
                    <p>Bem-vindo à família Sistema MF! 🎉</p>
                </div>
                
                <div class="footer">
                    <p>Este é um email automático, por favor não responda.</p>
                    <p>&copy; ${new Date().getFullYear()} Sistema MF - Todos os direitos reservados</p>
                </div>
            </body>
            </html>
        `;

        return await sendEmailService.execute({
            to: storeEmail,
            subject,
            html,
        });
    }
}

export { SendWelcomeEmailService };
