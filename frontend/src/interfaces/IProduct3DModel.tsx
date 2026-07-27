export interface IProduct3DModel {
    id: string;
    product_id: string;
    model_url: string;
    original_filename: string;
    file_size: number;
    created_at?: string;
    updated_at?: string;
}

export interface IProductWith3DModel {
    id: string;
    name: string;
    image?: string;
    categories?: Array<{ category: { id: string; name: string } }>;
    model3d: IProduct3DModel | null;
}

export interface IPublicProductWith3DModel {
    id: string;
    name: string;
    image?: string;
    categories?: Array<{ category: { id: string; name: string } }>;
    model3d: { model_url: string };
}
