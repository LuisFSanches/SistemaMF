export interface IEmail {
    to: string;
    subject: string;
    html: string;
}

export interface IWelcomeEmail {
    storeName: string;
    storeEmail: string;
    username: string;
    temporaryPassword: string;
}
