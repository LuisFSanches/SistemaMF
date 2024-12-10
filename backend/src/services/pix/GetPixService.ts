import axios from 'axios';
import { format, subDays } from 'date-fns'

class GetPixService{
    async execute(token: string, httpsAgent: any, initial_date: any, final_date: any, limit: any) {
        const params = new URLSearchParams({
            dataInicio: initial_date,
            dataFim: final_date,
            tipoTransacao: "PIX"
        });

        try {
            const url = `https://cdpj.partners.bancointer.com.br/banking/v2/extrato/completo?${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            });

            const transactions = response.data.transacoes;

            if (!Array.isArray(transactions)) {
                throw new Error("O campo 'transactions' não é um array.");
            }

            const receivedTransactions = transactions.filter((transaction: any) => transaction.titulo === 'Pix recebido');

            if (limit) {
                return receivedTransactions.slice(0, limit);
            }

            return receivedTransactions;
        } catch(error: any) {
            console.log('DEU ERRRO', error);
        }
    }
}

export { GetPixService }