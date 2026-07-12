export interface ISubscriptionPlan {
    id?: string
    name: string
    description?: string
    price: number
    billing_cycle: string // "MONTHLY" | "ANNUAL"
    mp_plan_id?: string
    is_active?: boolean
    created_at?: Date
    updated_at?: Date
}

export interface ICreateSubscriptionPlan {
    name: string
    description?: string
    price: number
    billing_cycle: string
    mp_plan_id?: string
    is_active?: boolean
}

export interface IUpdateSubscriptionPlan {
    name?: string
    description?: string
    price?: number
    billing_cycle?: string
    mp_plan_id?: string
    is_active?: boolean
}