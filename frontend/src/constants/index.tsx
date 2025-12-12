import { Status } from "../interfaces/IStatus";

export const STATUS_LABEL: Record<Status, string>= {
  "OPENED": "Aberto",
  "WAITING_FOR_CLIENT": "Aguardando Cliente",
  "IN_PROGRESS": "Em andamento",
  "IN_DELIVERY": "Em entrega",
  "DONE": "Finalizado",
  "CANCELED": "Cancelado"
}

export const PAYMENT_METHODS = {
  "CASH": "Dinheiro",
  "PIX": "Pix",
  "CARD": "Cartão"
}

export const PAYMENT_RECEIVED = {
  "true": "Pago",
  "false": "Não pago"
}

export const HAS_CARD = {
  "true": "Possui cartão",
  "false": "Não tem cartão"
}

export const ADMIN_ROLES = {
  "ADMIN": "ADMIN",
  "SUPER_ADMIN": "SUPER_ADMIN"
}

export const TYPES_OF_DELIVERY = {
  "MY_GIFT": "É presente. Mas eu Mesmo vou receber",
  "MY_PRODUCT": "Não é Presente. Eu mesmo que vou receber",
  "SOMEONES_GIFT": "É Presente. Outra pessoa vai receber"
}

export const STATES = {
  "AC": "Acre",
  "AL": "Alagoas",
  "AP": "Amapá",
  "AM": "Amazonas",
  "BA": "Bahia",
  "CE": "Ceará",
  "DF": "Distrito Federal",
  "ES": "Espírito Santo",
  "GO": "Goiás",
  "MA": "Maranhão",
  "MT": "Mato Grosso",
  "MS": "Mato Grosso do Sul",
  "MG": "Minas Gerais",
  "PA": "Pará",
  "PB": "Paraíba",
  "PR": "Paraná",
  "PE": "Pernambuco",
  "PI": "Piauí",
  "RJ": "Rio de Janeiro",
  "RN": "Rio Grande do Norte",
  "RS": "Rio Grande do Sul",
  "RO": "Rondônia",
  "RR": "Roraima",
  "SC": "Santa Catarina",
  "SP": "São Paulo",
  "SE": "Sergipe",
  "TO": "Tocantins"
}

export const UNITIES = {
  "CX": "Caixa",
  "UN": "Unidade",
  "KG": "Quilograma",
  "L": "Litro",
  "M": "Metro",
}

export const ORDERS_TO_RECEIVE_TYPES = {
  "PROMISSORY": "Promissório",
  "BOLETO": "Boleto"
}

export const PUBLIC_ROUTES = [
  'completarPedido',
  'concluirEntrega',
  '/carrinho',
  '/checkout'
]
