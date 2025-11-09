# SuccessMessage Component

Componente de notificação de sucesso que aparece no topo direito da tela com animação de entrada e saída.

## Características

- Aparece no topo direito da tela
- Fundo verde claro (`#d1fae5`) com texto verde escuro (`#065f46`)
- Animação de slide da direita para esquerda
- Fecha automaticamente após 4 segundos
- Suporta múltiplas mensagens empilhadas verticalmente
- Botão de fechar manual

## Como Usar

### 1. Importar o hook

```tsx
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
```

### 2. Usar no componente

```tsx
export function MeuComponente() {
    const { showSuccess } = useSuccessMessage();
    
    const handleAction = async () => {
        try {
            // Sua lógica aqui
            await criarAlgo();
            
            // Exibir mensagem de sucesso
            showSuccess("Item criado com sucesso!");
        } catch (error) {
            // Tratar erro
        }
    };
    
    return (
        // Seu JSX
    );
}
```

## Exemplos de Mensagens

- `"Pedido criado com sucesso!"`
- `"Produto atualizado com sucesso!"`
- `"Cliente cadastrado com sucesso!"`
- `"Alterações salvas!"`
- `"Item excluído com sucesso!"`

## Implementação Atual

Atualmente implementado em:
- `OnStoreOrder` - Após criação de pedido com `createOrder()`

## Próximas Implementações Sugeridas

- Criação/edição de produtos
- Criação/edição de clientes
- Criação/edição de administradores
- Atualização de status de pedidos
- Ações de estoque
- Configurações do sistema
