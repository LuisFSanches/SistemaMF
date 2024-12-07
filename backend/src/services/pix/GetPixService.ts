import axios from 'axios';
import { format, subDays } from 'date-fns'

class GetPixService{
    async execute(token: string, httpsAgent: any, initial_date: any, final_date: any, limit: any) {
        const params = new URLSearchParams({
            dataInicio: initial_date,
            dataFim: final_date
        });

        try {
            const url = `https://cdpj.partners.bancointer.com.br/banking/v2/extrato?${params.toString()}`;

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

            const sortedTransactions = transactions.sort((a: any, b: any) => {
                const dateA = new Date(a.dataEntrada);
                const dateB = new Date(b.dataEntrada);
                return dateB.getTime() - dateA.getTime();
            });

            if (limit) {
                return sortedTransactions.slice(0, limit);
            }

            return sortedTransactions;
        } catch(error: any) {
            console.log('DEU ERRRO', error);
        }
    }
}

export { GetPixService }