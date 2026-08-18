import { AsYouType, getCountryCallingCode, CountryCode } from "libphonenumber-js";

export const DEFAULT_COUNTRY: CountryCode = "BR";

export const formatNationalPhone = (phoneNumber?: string, countryCode?: string) => {
    if (!phoneNumber) return "";

    try {
        return new AsYouType((countryCode || DEFAULT_COUNTRY) as CountryCode).input(phoneNumber);
    } catch {
        return phoneNumber;
    }
};

export const getDdi = (countryCode?: string) => {
    try {
        return getCountryCallingCode((countryCode || DEFAULT_COUNTRY) as CountryCode);
    } catch {
        return "";
    }
};
