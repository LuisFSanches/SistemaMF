function formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function formatDiscountValue(discountType: string, discountValue: number): string {
    return discountType === "PERCENTAGE" ? `${discountValue}%` : formatCurrency(discountValue);
}

export function formatMonetaryValue(value: number): string {
    return formatCurrency(value);
}
