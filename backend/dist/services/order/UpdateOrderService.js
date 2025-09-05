"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/order/UpdateOrderService.ts
var UpdateOrderService_exports = {};
__export(UpdateOrderService_exports, {
  UpdateOrderService: () => UpdateOrderService
});
module.exports = __toCommonJS(UpdateOrderService_exports);
var import_moment_timezone = __toESM(require("moment-timezone"));

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

// src/services/order/UpdateOrderService.ts
var UpdateOrderService = class {
  async execute(data) {
    const order = {
      ...data
    };
    delete order.products;
    try {
      const formattedDeliveryDate = import_moment_timezone.default.utc(order.delivery_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      const updatedOrder = await prisma_default.order.update({
        where: {
          id: data.id
        },
        data: {
          ...order,
          delivery_date: formattedDeliveryDate,
          orderItems: {
            update: data.products.filter((product) => product.id).map((product) => ({
              where: {
                id: product.id
              },
              data: {
                product_id: product.product_id,
                quantity: Number(product.quantity),
                price: Number(product.price)
              }
            })),
            create: data.products.filter((product) => !product.id).map((product) => ({
              product_id: product.product_id,
              quantity: Number(product.quantity),
              price: Number(product.price)
            }))
          }
        },
        include: {
          client: true,
          clientAddress: true,
          createdBy: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
      return updatedOrder;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateOrderService
});
