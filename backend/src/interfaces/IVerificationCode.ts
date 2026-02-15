export interface IRequestVerification {
    phone_number: string;
    email: string;
}

export interface IValidateCode {
    phone_number: string;
    code: string;
}

export interface IVerificationCode {
    id?: string;
    client_id: string;
    code: string;
    expires_at: Date;
    is_used?: boolean;
    created_at?: Date;
}
