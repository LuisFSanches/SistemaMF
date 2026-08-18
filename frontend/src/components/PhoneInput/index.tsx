import { Controller, Control, FieldValues, Path, UseFormSetValue, useWatch } from "react-hook-form";
import PhoneInputBase, { Country } from "react-phone-number-input";
import ptBRLabels from "react-phone-number-input/locale/pt-BR.json";
import { parsePhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { PhoneInputWrapper } from "./style";
import { DEFAULT_COUNTRY } from "./utils";

interface PhoneInputProps<T extends FieldValues> {
    control: Control<T>;
    setValue: UseFormSetValue<T>;
    phoneFieldName: Path<T>;
    countryFieldName: Path<T>;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
}

export function PhoneInput<T extends FieldValues>({
    control,
    setValue,
    phoneFieldName,
    countryFieldName,
    disabled,
    required,
    placeholder = "Telefone",
}: PhoneInputProps<T>) {
    const countryValue = (useWatch({ control, name: countryFieldName }) as Country) || DEFAULT_COUNTRY;

    return (
        <Controller
            name={phoneFieldName}
            control={control}
            rules={required ? { required: "Telefone inválido" } : undefined}
            render={({ field, fieldState }) => {
                const e164Value = field.value
                    ? (() => {
                        try {
                            const parsed = parsePhoneNumber(field.value, countryValue);
                            return parsed?.number;
                        } catch {
                            return undefined;
                        }
                    })()
                    : undefined;

                return (
                    <PhoneInputWrapper $hasError={!!fieldState.error}>
                        <PhoneInputBase
                            key={countryValue}
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry={countryValue}
                            labels={ptBRLabels as any}
                            countrySelectProps={{ unicodeFlags: true }}
                            disabled={disabled}
                            placeholder={placeholder}
                            value={e164Value}
                            onChange={(value) => {
                                if (!value) {
                                    field.onChange("");
                                    return;
                                }

                                try {
                                    const parsed = parsePhoneNumber(value, countryValue);
                                    field.onChange(parsed?.nationalNumber || "");
                                } catch {
                                    field.onChange(value);
                                }
                            }}
                            onCountryChange={(country) => {
                                setValue(countryFieldName, (country || DEFAULT_COUNTRY) as any);
                            }}
                        />
                        {fieldState.error && <span className="error">{fieldState.error.message}</span>}
                    </PhoneInputWrapper>
                );
            }}
        />
    );
}
