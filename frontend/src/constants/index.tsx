import { Status } from "../interfaces/IStatus";

export const STATUS_LABEL: Record<Status, string>= {
  "OPENED": "Aberto",
  "WAITING_FOR_CLIENT": "Aguardando Cliente",
  "IN_PROGRESS": "Em andamento",
  "IN_DELIVERY": "Em entrega",
  "DONE": "Finalizado"
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