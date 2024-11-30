import { Status } from "../interfaces/IStatus";

export const STATUS_LABEL: Record<Status, string>= {
  "OPENED": "Aberto",
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