export interface ISubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billing_cycle: "MONTHLY" | "ANNUAL";
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface ISubscription {
    id: string;
    store_id: string;
    subscription_plan_id: string;
    status: "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";
    start_date: string;
    end_date?: string;
    next_billing_date: string;
    trial_end_date?: string;
    is_trial: boolean;
    mp_subscription_id?: string;
    created_at: string;
    updated_at?: string;
    current_plan?: ISubscriptionPlan;
}

export interface ISubscriptionStatus {
    store_id: string;
    is_trial: boolean;
    is_active: boolean;
    days_remaining?: number;
    current_plan?: ISubscriptionPlan;
    trial_end_date?: string;
    next_billing_date?: string;
}

export interface IOrderCharge {
    id: string;
    store_id: string;
    order_id: string;
    amount: number;
    status: "PENDING" | "CHARGED" | "FAILED";
    billing_month: string;
    charge_date: string;
    charged_at?: string;
    order?: {
        code: number;
        total: number;
        online_order: boolean;
    };
}

export interface IMonthHistory {
    billing_month: string;
    total_orders: number;
    total_amount: number;
    status: "NO_CHARGES" | "PENDING" | "CHARGED" | "FAILED";
}

export interface INextBill {
    amount: number;
    due_date: string;
    includes_subscription: number;
    includes_order_charges: number;
}

export interface IBillingInfo {
    subscription_status: ISubscriptionStatus;
    months_history: IMonthHistory[];
    next_bill: INextBill;
}

export interface ICreateSubscriptionData {
    store_id: string;
    subscription_plan_id: string;
    mp_subscription_id?: string;
}
