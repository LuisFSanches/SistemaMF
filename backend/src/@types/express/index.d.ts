import { Admin } from "@prisma/client";
import express from "express";
import { ISubscriptionStatus } from "../../interfaces/ISubscription";

declare module 'express' {
  export interface Request {
    admin?: Admin
    subscription_status?: ISubscriptionStatus
  }
}
