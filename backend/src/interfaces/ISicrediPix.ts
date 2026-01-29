export interface ISicrediCobranca {
    calendario: {
        expiracao: number;
    };
    devedor?: {
        cpf?: string;
        cnpj?: string;
        nome: string;
    };
    valor: {
        original: string;
    };
    chave: string;
    solicitacaoPagador?: string;
    infoAdicionais?: Array<{
        nome: string;
        valor: string;
    }>;
}

export interface ISicrediWebhook {
    webhookUrl: string;
    chave: string;
}
