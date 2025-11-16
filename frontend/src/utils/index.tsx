export const rawTelephone = (phoneNumber: string,) => {
    const numericValue = phoneNumber?.replace(/[^0-9]/g, "");
    return numericValue;
};

export const convertMoney = (value: number) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value
    const formatedValue = numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return formatedValue
};

export const formatTitleCase = (text: string) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const formatDescription = (description: string|undefined): string[] => {
    if (!description) return [];

    return description
        .split('\n')
        .map(line => {
            const clean = line.replace(/\s*-\s*R\$\s*\d+(\.\d{1,2})?/, '');
            return clean.trim();
        })
        .filter(Boolean);
};

export const formatDescriptionWithPrice = (description: string|undefined): string[] => {
    if (!description) return [];

    return description
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
}