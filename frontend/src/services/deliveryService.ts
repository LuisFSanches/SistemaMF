import axios from "axios";
import { api } from "./api";

export interface IAttendedCity {
    id: string;
    store_id: string;
    city: string;
    state: string;
    created_at: string;
}

export interface IDeliveryRange {
    id: string;
    store_id: string;
    min_km: number;
    max_km: number;
    price: number;
    created_at: string;
}

export const getAttendedCities = async (storeId: string): Promise<IAttendedCity[]> => {
    const response = await api.get(`/storeAttendedCity/store/${storeId}`);
    return response.data;
};

export const createAttendedCity = async (data: {
    store_id: string;
    city: string;
    state: string;
}): Promise<IAttendedCity> => {
    const response = await api.post('/storeAttendedCity', data);
    return response.data;
};

export const deleteAttendedCity = async (id: string): Promise<void> => {
    await api.delete(`/storeAttendedCity/${id}`);
};

export const getDeliveryRanges = async (storeId: string): Promise<IDeliveryRange[]> => {
    const response = await api.get(`/deliveryRange/store/${storeId}`);
    return response.data;
};

export const createDeliveryRange = async (data: {
    store_id: string;
    min_km: number;
    max_km: number;
    price: number;
}): Promise<IDeliveryRange> => {
    const response = await api.post('/deliveryRange', data);
    return response.data;
};

export const deleteDeliveryRange = async (id: string): Promise<void> => {
    await api.delete(`/deliveryRange/${id}`);
};

export interface ICalculateDeliveryRequest {
    storeId: string;
    customerLatitude: number;
    customerLongitude: number;
    city: string;
}

export interface ICalculateDeliveryResponse {
    distance_km: number;
    delivery_price: number;
}

export interface IViaCepResponse {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

export interface INominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

export const fetchAddressByCep = async (cep: string): Promise<IViaCepResponse> => {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await axios.get<IViaCepResponse>(
        `https://viacep.com.br/ws/${cleanCep}/json/`
    );
    if (response.data.erro) {
        throw new Error('CEP não encontrado');
    }
    return response.data;
};

export const geocodeAddress = async (
    bairro: string,
    cidade: string,
    estado: string
): Promise<{ lat: number; lng: number }> => {
    const query = `${bairro}, ${cidade}, ${estado}, Brasil`;
    const response = await axios.get<INominatimResult[]>(
        `https://nominatim.openstreetmap.org/search`,
        {
            params: { q: query, format: 'json', limit: 1 },
            headers: { 'Accept-Language': 'pt-BR' },
        }
    );
    if (!response.data || response.data.length === 0) {
        throw new Error('Não foi possível obter coordenadas para o endereço');
    }
    return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
    };
};

export const calculateDeliveryFee = async (
    data: ICalculateDeliveryRequest
): Promise<ICalculateDeliveryResponse> => {
    const response = await api.post<ICalculateDeliveryResponse>(
        '/delivery/calculate',
        data
    );
    return response.data;
};
