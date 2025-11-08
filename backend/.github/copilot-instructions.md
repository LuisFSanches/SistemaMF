# Documentação de Padrões do Projeto - Sistema MF Backend

> **Objetivo**: Esta documentação serve como referência para IAs (GitHub Copilot, etc.) e desenvolvedores sobre os padrões arquiteturais e de código do projeto.

---

## 📋 Índice

1. [Criação de Migrations](#1-criação-de-migrations)
2. [Estrutura do Banco de Dados](#2-estrutura-do-banco-de-dados)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Padrão de Criação de Arquivos](#4-padrão-de-criação-de-arquivos)
5. [Padrão de Criação de Testes](#5-padrão-de-criação-de-testes)
6. [Convenções de Código](#6-convenções-de-código)

---

## 1. Criação de Migrations

### Tecnologia
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL

### Processo de Criação

#### 1.1. Modificar o Schema
Edite o arquivo `prisma/schema.prisma` com as alterações necessárias.

```prisma
model NomeDoModelo {
  id         String   @id @default(uuid())
  campo      String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("nome_da_tabela")
}
```

#### 1.2. Gerar Migration
Execute o comando Prisma para criar a migration:

```bash
yarn prisma migrate dev --name descricao_da_alteracao
```

**Convenção de Nomenclatura de Migrations:**
- Use snake_case
- Seja descritivo e específico
- Exemplos:
  - `create_main_table`
  - `create_pickup_on_store_column`
  - `implement_online_order`
  - `add_products_to_orders`
  - `create_stock_transaction_table`

#### 1.3. Estrutura de Migrations
Migrations são armazenadas em: `prisma/migrations/YYYYMMDDHHMMSS_nome_descritivo/migration.sql`

Exemplo de SQL de migration:
```sql
-- CreateTable
CREATE TABLE "nome_tabela" (
    "id" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nome_tabela_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (se necessário)
CREATE UNIQUE INDEX "nome_tabela_campo_key" ON "nome_tabela"("campo");
```

---

## 2. Estrutura do Banco de Dados

### Convenções Gerais

#### 2.1. Nomenclatura
- **Tabelas**: snake_case, plural (ex: `clients`, `orders`, `admins`)
- **Colunas**: snake_case (ex: `first_name`, `phone_number`, `created_at`)
- **IDs**: Sempre `UUID` (`@default(uuid())`)
- **Timestamps**: `created_at` (DateTime @default(now())), `updated_at` (DateTime @updatedAt)

#### 2.2. Padrão de Modelo Prisma

```prisma
model NomeModelo {
  id          String    @id @default(uuid())
  campo1      String
  campo2      Float
  campo3      Boolean   @default(false)
  campo4      String?   // Opcional
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  // Relacionamentos
  relacionamento RelacionadoModel @relation(fields: [campo_fk], references: [id])
  
  @@map("nome_tabela_plural")
}
```

#### 2.3. Relacionamentos
- **One-to-Many**: Usar `@relation` com campo de chave estrangeira
- **Many-to-Many**: Criar tabela intermediária com dois relacionamentos
- **Relacionamentos Nomeados**: Quando há múltiplos relacionamentos com a mesma tabela

Exemplo de relacionamento múltiplo:
```prisma
model Order {
  created_by String
  updated_by String
  
  createdBy  Admin @relation("createdBy", fields: [created_by], references: [id])
  updatedBy  Admin @relation("updatedBy", fields: [updated_by], references: [id])
}
```

### 2.4. Principais Modelos do Sistema

**Admin**: Usuários administrativos do sistema
**Client**: Clientes finais
**Address**: Endereços dos clientes
**Product**: Produtos disponíveis para venda
**Order**: Pedidos realizados
**OrderItem**: Itens individuais de cada pedido
**StockTransaction**: Transações de estoque (entrada de produtos)

---

## 3. Estrutura do Projeto

### 3.1. Arquitetura em Camadas

O projeto segue uma arquitetura em três camadas principais:

```
Controller → Service → Database (Prisma)
     ↓         ↓           ↓
   HTTP    Business     Data Access
  Layer     Logic        Layer
```

### 3.2. Organização de Diretórios

```
src/
├── controllers/       # Camada de apresentação (HTTP)
│   ├── admin/
│   ├── client/
│   ├── order/
│   └── [entidade]/
│       ├── CreateXController.ts
│       ├── GetXController.ts
│       ├── GetAllXController.ts
│       ├── UpdateXController.ts
│       └── DeleteXController.ts
│
├── services/         # Camada de negócio
│   ├── admin/
│   ├── client/
│   └── [entidade]/
│       ├── CreateXService.ts
│       ├── GetXService.ts
│       ├── GetAllXService.ts
│       ├── UpdateXService.ts
│       ├── DeleteXService.ts
│       └── test/
│           └── CreateXService.spec.ts
│
├── middlewares/      # Middlewares globais
│   ├── admin_auth.ts
│   ├── super_admin_auth.ts
│   └── errors.ts
│
├── schemas/          # Validação Zod
│   └── [entidade]/
│       ├── createX.ts
│       └── updateX.ts
│
├── interfaces/       # TypeScript interfaces
│   ├── IClient.ts
│   ├── IAdmin.ts
│   └── IX.ts
│
├── exceptions/       # Exceções customizadas
│   ├── root.ts
│   ├── bad-request.ts
│   └── unauthorized.ts
│
├── facades/          # Padrão Facade para operações complexas
│   └── OrderFacade.ts
│
├── events/           # Event Emitters
│   └── orderEvents.ts
│
├── utils/            # Funções utilitárias
│   └── adjustDeliveryDate.ts
│
├── prisma/           # Configuração Prisma Client
│   ├── index.ts
│   └── Prisma.ts
│
├── routes.ts         # Definição de rotas
├── server.ts         # Inicialização do servidor
└── error-handler.ts  # Handler global de erros
```

### 3.3. Fluxo de Requisição

```
1. HTTP Request
   ↓
2. Route (routes.ts) → Middleware (opcional)
   ↓
3. Controller (handle method)
   ↓
4. Service (execute method)
   ├── Schema Validation (Zod)
   ├── Business Logic
   └── Prisma Query
   ↓
5. Response (JSON)
```

---

## 4. Padrão de Criação de Arquivos

### 4.1. Controllers

**Localização**: `src/controllers/[entidade]/[Acao][Entidade]Controller.ts`

**Template**:
```typescript
import { Request, Response, NextFunction } from 'express';
import { NomeService } from '../../services/entidade/NomeService';

class NomeController {
    async handle(req: Request, res: Response, next: NextFunction) {
        // Extrair dados do request (body, params, query)
        const { campo1, campo2 } = req.body;
        const { id } = req.params;

        // Instanciar o service
        const nomeService = new NomeService();

        // Executar a lógica de negócio
        const resultado = await nomeService.execute({
            campo1,
            campo2,
            id
        });
        
        // Retornar resposta
        return res.json(resultado);
    }
}

export { NomeController };
```

**Convenções**:
- Nome do arquivo: `[Acao][Entidade]Controller.ts` (ex: `CreateClientController.ts`)
- Nome da classe: Mesmo do arquivo
- Método principal: `handle(req, res, next)`
- Export nomeado usando chaves `{ NomeController }`

### 4.2. Services

**Localização**: `src/services/[entidade]/[Acao][Entidade]Service.ts`

**Template**:
```typescript
import { IEntidade } from "../../interfaces/IEntidade";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { nomeSchema } from "../../schemas/entidade/nomeSchema";
import { BadRequestException } from "../../exceptions/bad-request";

class NomeService {
    async execute(data: IEntidade) {
        // 1. Validação com Zod
        const parsed = nomeSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Validações de negócio
        const existente = await prismaClient.entidade.findFirst({
            where: { campo: data.campo },
        });

        if (existente) {
            throw new BadRequestException(
                "Registro já existe",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // 3. Operação no banco
        try {
            const resultado = await prismaClient.entidade.create({ 
                data 
            });
            
            return resultado;
        } catch (error: any) {
            console.error("[NomeService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { NomeService };
```

**Convenções**:
- Nome do arquivo: `[Acao][Entidade]Service.ts` (ex: `CreateClientService.ts`)
- Nome da classe: Mesmo do arquivo
- Método principal: `execute(data)`
- Sempre validar com Zod antes de processar
- Tratamento de erros com try/catch
- Log de erros com `console.error`
- Export nomeado usando chaves

### 4.3. Schemas (Validação Zod)

**Localização**: `src/schemas/[entidade]/[acao][Entidade].ts`

**Template**:
```typescript
import { z } from "zod";

export const nomeSchema = z.object({
    campo1: z.string().nonempty("campo1 is required"),
    campo2: z.string().email("Invalid email format"),
    campo3: z.number().positive("Must be positive"),
    campo4: z.boolean().optional(),
});

export type NomeSchemaType = z.infer<typeof nomeSchema>;
```

**Convenções**:
- Nome do arquivo: snake_case (ex: `createClient.ts`)
- Nome do schema: camelCase + "Schema" (ex: `createClientSchema`)
- Export nomeado do schema
- Mensagens de erro em inglês
- Usar métodos Zod apropriados: `.nonempty()`, `.email()`, `.min()`, `.max()`

### 4.4. Interfaces

**Localização**: `src/interfaces/I[Entidade].ts`

**Template**:
```typescript
export interface IEntidade {
    id?: string
    campo1: string
    campo2: string
    campo3?: number  // Opcional
    created_at?: DateTime
    updated_at?: DateTime
}
```

**Convenções**:
- Nome do arquivo: `I[Entidade].ts` (ex: `IClient.ts`)
- Nome da interface: `I[Entidade]` (ex: `IClient`)
- Campos opcionais com `?`
- Timestamps opcionais (nem sempre retornados)

### 4.5. Rotas

**Localização**: `src/routes.ts` (arquivo centralizado)

**Template**:
```typescript
import { Router } from 'express';
import { NomeController } from './controllers/entidade/NomeController';
import adminAuthMiddleware from './middlewares/admin_auth';

const router = Router();

// CRUD completo de uma entidade
router.post('/entidade', adminAuthMiddleware, new NomeController().handle);
router.get('/entidade/all', adminAuthMiddleware, new GetAllController().handle);
router.get('/entidade/:id', adminAuthMiddleware, new GetController().handle);
router.put('/entidade/:id', adminAuthMiddleware, new UpdateController().handle);
router.delete('/entidade/:id', adminAuthMiddleware, new DeleteController().handle);

export { router };
```

**Convenções de Rotas**:
- Agrupamento por entidade com comentários `//-- ROTAS ENTIDADE --`
- Padrão REST:
  - `POST /entidade` - Criar
  - `GET /entidade/all` - Listar todos
  - `GET /entidade/:id` - Buscar por ID
  - `PUT /entidade/:id` - Atualizar completamente
  - `PATCH /entidade/:id` - Atualizar parcialmente
  - `DELETE /entidade/:id` - Deletar
- Instanciar controllers diretamente nas rotas: `new NomeController().handle`
- Middlewares aplicados antes do controller

### 4.6. Middlewares

**Localização**: `src/middlewares/nome_middleware.ts`

**Template**:
```typescript
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { UnauthorizedRequestException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import prismaClient from "../prisma";
import { IPayload } from "../interfaces/IPayload";

const nomeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Lógica do middleware
        const token = req.headers.authorization as string;
        
        if (!token) {
            next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
        }

        const payload: IPayload = jwt.verify(token, process.env.JWT_SECRET!) as IPayload;
        
        // Adicionar dados ao request
        req.admin = payload;
        
        next();
    } catch(error) {
        next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
    }
}

export default nomeMiddleware;
```

**Convenções**:
- Nome do arquivo: snake_case (ex: `admin_auth.ts`)
- Export default da função
- Sempre chamar `next()` ou `next(error)`
- Usar exceções customizadas

### 4.7. Exceções Customizadas

**Localização**: `src/exceptions/nome-exception.ts`

**Template**:
```typescript
import { HttpException } from "./root";

export class NomeException extends HttpException {
    constructor(message: string, errorCode: any, errors?: any) {
        super(message, errorCode, 400, errors); // Status code HTTP
    }
}
```

**Exceções Existentes**:
- `BadRequestException` (400)
- `UnauthorizedRequestException` (401)
- `HttpException` (base)

**ErrorCodes** (`src/exceptions/root.ts`):
```typescript
export enum ErrorCodes {
    USER_NOT_FOUND = 400,
    USER_ALREADY_EXISTS = 400,
    INCORRECT_PASSWORD = 400,
    UNAUTHORIZED = 401,
    BAD_REQUEST = 404,
    SYSTEM_ERROR = 500,
    AUTHORIZED = 200,
    VALIDATION_ERROR = 400
}
```

### 4.8. Facades (Operações Complexas)

**Localização**: `src/facades/[Nome]Facade.ts`

**Uso**: Quando uma operação requer coordenação de múltiplos services.

**Exemplo**: `OrderFacade.ts`
```typescript
class OrderFacade {
    private createClientService: CreateClientService;
    private getClientByPhoneService: GetClientByPhoneNumberService;
    private createAddressService: CreateAddressService;
    
    constructor(/* injeção de dependências */) {
        // inicializar services
    }

    async createOrder(data: any) {
        // 1. Verificar/criar cliente
        // 2. Verificar/criar endereço
        // 3. Criar pedido
        // Coordenar múltiplas operações
    }
}
```

---

## 5. Padrão de Criação de Testes

### 5.1. Tecnologia
- **Framework**: Vitest
- **Mocking**: vitest-mock-extended

### 5.2. Localização
`src/services/[entidade]/test/[Nome]Service.spec.ts`

### 5.3. Template de Teste

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { NomeService } from '../NomeService';

// Mock do Prisma Client
vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('NomeService', () => {
    let service: NomeService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new NomeService();
    });

    it('should [descrição do comportamento esperado]', async () => {
        // Arrange - Preparar dados
        const mockData = {
            id: 'abc123',
            campo1: 'valor1',
            campo2: 'valor2',
            created_at: new Date(),
            updated_at: new Date()
        };

        // Mock da resposta do Prisma
        (prismaClient as DeepMockProxy<PrismaClient>)
            .entidade
            .create
            .mockResolvedValue(mockData);

        // Act - Executar ação
        const result = await service.execute({
            campo1: 'valor1',
            campo2: 'valor2'
        });

        // Assert - Verificar resultado
        expect(prismaClient.entidade.create).toHaveBeenCalledWith({
            data: {
                campo1: 'valor1',
                campo2: 'valor2'
            }
        });
        expect(result).toEqual(mockData);
    });

    it('should throw error when validation fails', async () => {
        // Arrange
        const invalidData = {
            campo1: '', // Inválido
        };

        // Act & Assert
        await expect(service.execute(invalidData))
            .rejects
            .toThrow();
    });

    it('should throw error when record already exists', async () => {
        // Arrange
        const existingData = { id: 'existing-id', campo1: 'valor' };
        
        (prismaClient as DeepMockProxy<PrismaClient>)
            .entidade
            .findFirst
            .mockResolvedValue(existingData);

        // Act & Assert
        await expect(service.execute({ campo1: 'valor' }))
            .rejects
            .toThrow('Registro já existe');
    });
});
```

### 5.4. Convenções de Testes

**Nomenclatura**:
- Arquivo: `[Nome]Service.spec.ts`
- describe: Nome do service
- it: Descrição em inglês do comportamento ("should...")

**Estrutura AAA**:
1. **Arrange**: Preparar dados e mocks
2. **Act**: Executar a função testada
3. **Assert**: Verificar o resultado

**Casos de Teste Comuns**:
- ✅ Sucesso na operação principal
- ❌ Falha na validação (dados inválidos)
- ❌ Registro duplicado
- ❌ Registro não encontrado
- ❌ Erro no banco de dados

**Mocking**:
- Mock do Prisma Client usando `vitest-mock-extended`
- Mock de respostas com `.mockResolvedValue()`
- Limpar mocks em `beforeEach` com `vi.clearAllMocks()`

### 5.5. Executar Testes

```bash
# Rodar todos os testes
yarn test

# Rodar testes com coverage
yarn coverage

# Rodar em modo watch
yarn test --watch
```

### 5.6. Configuração do Vitest

**Arquivo**: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [
            'node_modules',
            'dist',
            'build',
            '.data',
            '**/node_modules/**',
            '**/dist/**',
            '**/.data/**',
            '**/vendor/**'
        ],
        coverage: {
            reporter: ['text', 'json', 'html'],
            provider: 'v8',
            exclude: ['**/node_modules/**', '**/dist/**', '**/.data/**', '**/vendor/**']
        }
    }
})
```

---

## 6. Convenções de Código

### 6.1. TypeScript

**Configuração**: `tsconfig.json`
- Strict mode habilitado
- Target: ES6+
- Module: CommonJS

### 6.2. Imports
```typescript
// 1. Imports externos
import express from 'express';
import { Request, Response } from 'express';

// 2. Imports internos (absolutos)
import prismaClient from '../../prisma';
import { NomeService } from '../../services/nome/NomeService';
import { IEntidade } from '../../interfaces/IEntidade';
```

### 6.3. Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivos | PascalCase para classes, snake_case para configs | `CreateClientService.ts`, `admin_auth.ts` |
| Classes | PascalCase | `CreateClientService` |
| Interfaces | PascalCase com prefixo "I" | `IClient`, `IAdmin` |
| Variáveis | camelCase | `clientData`, `adminId` |
| Constantes | UPPER_SNAKE_CASE | `JWT_SECRET`, `PORT` |
| Funções | camelCase | `execute()`, `handle()` |
| Enums | PascalCase (nome), UPPER_SNAKE_CASE (valores) | `ErrorCodes.USER_NOT_FOUND` |

### 6.4. Async/Await
- Sempre usar `async/await` ao invés de Promises `.then()`
- Handler de erros com try/catch
- Propagação de erros com `throw`

### 6.5. Error Handling
```typescript
// Service
throw new BadRequestException(
    "Mensagem de erro",
    ErrorCodes.TIPO_ERRO
);

// Server
app.use(errorMiddleware); // Global error handler
```

### 6.6. Variáveis de Ambiente
```typescript
// Sempre usar process.env com type assertion
const secret = process.env.JWT_SECRET!;
const port = Number(process.env.PORT) || 3333;
```

### 6.7. Prisma Client
```typescript
// Importar do arquivo centralizado
import prismaClient from '../../prisma';

// Uso
const cliente = await prismaClient.client.findFirst({
    where: { id },
    include: { addresses: true }
});
```

### 6.8. Autenticação
- JWT para autenticação
- Middlewares: `adminAuthMiddleware`, `superAdminAuthMiddleware`
- Token no header: `Authorization: <token>`
- Payload armazenado em `req.admin`

### 6.9. WebSockets (Socket.io)
- Usado para notificações em tempo real
- Event emitter: `orderEvents.ts`
- Emissão de eventos: `io.emit(OrderEvents.OnlineOrderReceived, data)`

### 6.10. CORS
- Configuração liberal para desenvolvimento
- Origin: '*' (ajustar para produção)

---

## 📝 Checklist para Novas Features

Ao implementar uma nova funcionalidade, siga este checklist:

- [ ] **Migration**: Criar migration se houver mudança no banco
- [ ] **Schema Prisma**: Atualizar `schema.prisma`
- [ ] **Interface**: Criar/atualizar interface em `src/interfaces/`
- [ ] **Schema Zod**: Criar validação em `src/schemas/`
- [ ] **Service**: Implementar lógica de negócio em `src/services/`
- [ ] **Controller**: Criar controller em `src/controllers/`
- [ ] **Rota**: Adicionar rota em `src/routes.ts`
- [ ] **Testes**: Criar testes unitários em `src/services/[entidade]/test/`
- [ ] **Middleware**: Aplicar middlewares de autenticação se necessário
- [ ] **Error Handling**: Usar exceções customizadas apropriadas
- [ ] **Documentação**: Atualizar esta documentação se necessário

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
yarn dev                          # Iniciar servidor em modo desenvolvimento

# Banco de Dados
yarn prisma migrate dev           # Criar e aplicar migration
yarn prisma migrate reset         # Resetar banco (desenvolvimento)
yarn prisma studio                # Interface visual do banco
yarn prisma generate              # Gerar Prisma Client

# Testes
yarn test                         # Rodar todos os testes
yarn coverage                     # Testes com cobertura

# Build e Produção
yarn build                        # Compilar TypeScript
yarn start                        # Iniciar servidor em produção
```

---

## 📚 Stack Tecnológica

- **Runtime**: Node.js 22.18
- **Linguagem**: TypeScript 5.4+
- **Framework Web**: Express 4.19
- **ORM**: Prisma 5.14
- **Banco de Dados**: PostgreSQL
- **Validação**: Zod 3.23
- **Autenticação**: JWT (jsonwebtoken)
- **Testes**: Vitest 3.2
- **WebSockets**: Socket.io 4.8
- **Build**: tsup 8.3

**Última Atualização**: Novembro 2025
**Versão**: 1.0.0
