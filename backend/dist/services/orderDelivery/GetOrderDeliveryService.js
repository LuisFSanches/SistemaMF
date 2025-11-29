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

// src/services/orderDelivery/GetOrderDeliveryService.ts
var GetOrderDeliveryService_exports = {};
__export(GetOrderDeliveryService_exports, {
  GetOrderDeliveryService: () => GetOrderDeliveryService
});
module.exports = __toCommonJS(GetOrderDeliveryService_exports);

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

// src/services/orderDelivery/GetOrderDeliveryService.ts
var GetOrderDeliveryService = class {
  async execute({ id }) {
    try {
      const orderDelivery = await prisma_default.orderDelivery.findFirst({
        where: { id },
        include: {
          order: {
            select: {
              code: true,
              total: true,
              delivery_fee: true,
              client: {
                select: {
                  first_name: true,
                  last_name: true,
                  phone_number: true
                }
              },
              clientAddress: {
                select: {
                  street: true,
                  street_number: true,
                  complement: true,
                  neighborhood: true,
                  reference_point: true,
                  city: true,
                  state: true
                }
              }
            }
          },
          deliveryMan: {
            select: {
              name: true,
              phone_number: true
            }
          }
        }
      });
      if (!orderDelivery) {
        throw new BadRequestException(
          "Order delivery not found",
          400 /* USER_NOT_FOUND */
        );
      }
      return orderDelivery;
    } catch (error) {
      console.error("[GetOrderDeliveryService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetOrderDeliveryService
});
