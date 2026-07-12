export interface ISubscription {
    id?: string
    store_id: string
    subscription_plan_id: string
    mp_subscription_id?: string | null
    status?: string // "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED"
    start_date?: Date | null
    end_date?: Date | null
    next_billing_date?: Date | null
    trial_end_date?: Date | null
    created_at?: Date
    updated_at?: Date
}

export interface ICreateSubscription {
    store_id: string
    subscription_plan_id: string
    mp_subscription_id?: string | null
    status?: string
    start_date?: Date | null
    end_date?: Date | null
    next_billing_date?: Date | null
    trial_end_date?: Date | null
}

export interface IUpdateSubscription {
    subscription_plan_id?: string
    mp_subscription_id?: string | null
    status?: string
    start_date?: Date | null
    end_date?: Date | null
    next_billing_date?: Date | null
    trial_end_date?: Date | null
}

export interface ISubscriptionStatus {
    store_id: string
    is_trial: boolean
    is_active: boolean
    days_remaining?: number
    current_plan?: {
        id: string
        name: string
        price: number
        billing_cycle: string
    }
    trial_end_date?: Date | null
    next_billing_date?: Date | null
}