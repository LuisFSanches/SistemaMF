export type CampaignStatus = "DRAFT" | "QUEUED" | "SENDING" | "COMPLETED" | "FAILED";

export interface ICampaign {
    id: string;
    store_id?: string | null;
    name: string;
    segment_id: string;
    template_id: string;
    coupon_id?: string | null;
    variable_values: (string | null)[];
    status: CampaignStatus;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    started_at?: string | Date | null;
    completed_at?: string | Date | null;
    created_at?: string | Date;
    updated_at?: string | Date;
    segment?: { id: string; name: string };
    template?: { id: string; name: string };
    coupon?: { id: string; code: string } | null;
}

export interface ICreateCampaignData {
    name: string;
    segment_id: string;
    template_id: string;
    coupon_id?: string;
    variable_values: (string | null)[];
}
