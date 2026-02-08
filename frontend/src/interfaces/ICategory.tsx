export interface ICategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
    created_at: string;
    updated_at: string;
    _count?: {
        products: number;
    };
}
