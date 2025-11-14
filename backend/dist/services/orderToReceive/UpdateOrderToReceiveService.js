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

// src/services/orderToReceive/UpdateOrderToReceiveService.ts
var UpdateOrderToReceiveService_exports = {};
__export(UpdateOrderToReceiveService_exports, {
  UpdateOrderToReceiveService: () => UpdateOrderToReceiveService
});
module.exports = __toCommonJS(UpdateOrderToReceiveService_exports);

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

// src/schemas/orderToReceive/updateOrderToReceive.ts
var import_zod = require("zod");
var updateOrderToReceiveSchema = import_zod.z.object({
  payment_due_date: import_zod.z.string().datetime("payment_due_date must be a valid datetime").optional(),
  received_date: import_zod.z.string().datetime("received_date must be a valid datetime").optional(),
  type: import_zod.z.string().nonempty("type cannot be empty").optional(),
  is_archived: import_zod.z.boolean().optional()
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/orderToReceive/UpdateOrderToReceiveService.ts
var UpdateOrderToReceiveService = class {
  async execute({ id, data }) {
    if (!id) {
      throw new BadRequestException(
        "id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    const parsed = updateOrderToReceiveSchema.safeParse({
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
    const orderToReceiveExists = await prisma_default.orderToReceive.findUnique({
      where: { id }
    });
    if (!orderToReceiveExists) {
      throw new BadRequestException(
        "Order to receive not found",
        400 /* USER_NOT_FOUND */
      );
    }
    try {
      const updatedOrderToReceive = await prisma_default.orderToReceive.update({
        where: { id },
        data: {
          payment_due_date: data.payment_due_date,
          received_date: data.received_date,
          type: data.type,
          is_archived: data.is_archived
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
      return updatedOrderToReceive;
    } catch (error) {
      console.error("[UpdateOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateOrderToReceiveService
});
