// src/utils/adjustDeliveryDate.ts
import moment from "moment-timezone";

/**
 * Ajusta a data de entrega garantindo o ano correto.
 * @param deliveryDate Data de entrega sem ano, ex: "25-12" ou "12/05"
 * @param format Formato esperado da data (default: "DD-MM")
 * @returns Data ajustada no formato YYYY-MM-DD
 */
export function adjustDeliveryDate(
    deliveryDate: string,
    format: string = "DD-MM"
): string {
    const now = moment().tz("America/Sao_Paulo");
    const currentYear = now.year();
    const currentMonth = now.month();

    let date = moment.tz(`${deliveryDate}-${currentYear}`, `${format}-YYYY`, "America/Sao_Paulo");

    if (!date.isValid()) {
        throw new Error(`Data inválida: ${deliveryDate}`);
    }

    if (date.month() < currentMonth) {
        date = date.add(1, "year");
    }

    return date.format("YYYY-MM-DD");
}
