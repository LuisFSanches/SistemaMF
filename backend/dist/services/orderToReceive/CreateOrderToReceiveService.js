"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/orderToReceive/CreateOrderToReceiveService.ts
var CreateOrderToReceiveService_exports = {};
__export(CreateOrderToReceiveService_exports, {
  CreateOrderToReceiveService: () => CreateOrderToReceiveService
});
module.exports = __toCommonJS(CreateOrderToReceiveService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/exceptions/root.ts
var HttpException = class extends Error {
  constructor(message, errorCode, statusCode, errors) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
};

// src/schemas/orderToReceive/createOrderToReceive.ts
var import_zod = require("zod");
var createOrderToReceiveSchema = import_zod.z.object({
  order_id: import_zod.z.string().uuid("order_id must be a valid UUID"),
  payment_due_date: import_zod.z.string().datetime("payment_due_date must be a valid datetime"),
  received_date: import_zod.z.string().datetime("received_date must be a valid datetime").optional(),
  type: import_zod.z.string().nonempty("type is required"),
  is_archived: import_zod.z.boolean().optional()
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/orderToReceive/CreateOrderToReceiveService.ts
var CreateOrderToReceiveService = class {
  async execute(data) {
    const parsed = createOrderToReceiveSchema.safeParse({
      ...data,
      payment_due_date: data.payment_due_date instanceof Date ? data.payment_due_date.toISOString() : data.payment_due_date,
      received_date: data.received_date ? data.received_date instanceof Date ? data.received_date.toISOString() : data.received_date : void 0
    });
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const orderExists = await prisma_default.order.findUnique({
      where: { id: data.order_id }
    });
    if (!orderExists) {
      throw new BadRequestException(
        "Order not found",
        400 /* USER_NOT_FOUND */
      );
    }
    const existingOrderToReceive = await prisma_default.orderToReceive.findFirst({
      where: { order_id: data.order_id }
    });
    if (existingOrderToReceive) {
      throw new BadRequestException(
        "An order to receive already exists for this order",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const orderToReceive = await prisma_default.orderToReceive.create({
        data: {
          order_id: data.order_id,
          payment_due_date: data.payment_due_date,
          received_date: data.received_date,
          type: data.type,
          is_archived: data.is_archived || false
        },
        include: {
          order: {
            select: {
              code: true,
              total: true,
              client: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  phone_number: true
                }
              }
            }
          }
        }
      });
      return orderToReceive;
    } catch (error) {
      console.error("[CreateOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateOrderToReceiveService
});
