export const rawTelephone = (phoneNumber: string,) => {
    const numericValue = phoneNumber?.replace(/[^0-9]/g, "");
    return numericValue;
};

export const formatTelephone = (phoneNumber: string,) => {
    if (!phoneNumber) return "";

    const numericValue = phoneNumber.replace(/[^0-9]/g, "");

    if (numericValue.length === 11) {
        return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
    } else if (numericValue.length === 10) {
        return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    } else {
        return phoneNumber;
    }
}

export const convertMoney = (value: number) => {
    if (value === null || value === undefined) return "";
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

export const checkPublicRoute = (currentPath: string, PUBLIC_ROUTES: string[]): boolean => {
    return PUBLIC_ROUTES.some(route => {
        if (route === '/') {
            return currentPath === '/';
        }
        return currentPath.includes(route);
    });
}