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

// src/services/order/UpdateOrderPaymentService.ts
var UpdateOrderPaymentService_exports = {};
__export(UpdateOrderPaymentService_exports, {
  UpdateOrderPaymentService: () => UpdateOrderPaymentService
});
module.exports = __toCommonJS(UpdateOrderPaymentService_exports);

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

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/order/UpdateOrderPaymentService.ts
var UpdateOrderPaymentService = class {
  async execute({ id, payment_received }) {
    try {
      const orderExists = await prisma_default.order.findUnique({
        where: { id }
      });
      if (!orderExists) {
        throw new BadRequestException(
          "Order not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const updateOrder = await prisma_default.order.update({
        where: {
          id
        },
        data: {
          payment_received
        },
        include: {
          client: true,
          clientAddress: true
        }
      });
      return updateOrder;
    } catch (error) {
      console.error("[UpdateOrderPaymentService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateOrderPaymentService
});
