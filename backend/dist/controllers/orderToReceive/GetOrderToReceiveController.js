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

// src/controllers/orderToReceive/GetOrderToReceiveController.ts
var GetOrderToReceiveController_exports = {};
__export(GetOrderToReceiveController_exports, {
  GetOrderToReceiveController: () => GetOrderToReceiveController
});
module.exports = __toCommonJS(GetOrderToReceiveController_exports);

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

// src/services/orderToReceive/GetOrderToReceiveService.ts
var GetOrderToReceiveService = class {
  async execute({ id }) {
    if (!id) {
      throw new BadRequestException(
        "id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const orderToReceive = await prisma_default.orderToReceive.findUnique({
        where: { id },
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
      if (!orderToReceive) {
        throw new BadRequestException(
          "Order to receive not found",
          400 /* USER_NOT_FOUND */
        );
      }
      return orderToReceive;
    } catch (error) {
      console.error("[GetOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/GetOrderToReceiveController.ts
var GetOrderToReceiveController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getOrderToReceiveService = new GetOrderToReceiveService();
    const orderToReceive = await getOrderToReceiveService.execute({ id });
    return res.json(orderToReceive);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetOrderToReceiveController
});
