import { Status } from "../interfaces/IStatus";

export const statusLabel: Record<Status, string>= {
  "OPENED": "Aberto",
  "IN_PROGRESS": "Em andamento",
  "IN_DELIVERY": "Em entrega",
  "DONE": "Finalizado"
}
