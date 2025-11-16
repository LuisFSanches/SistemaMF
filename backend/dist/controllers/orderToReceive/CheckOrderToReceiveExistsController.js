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

// src/controllers/orderToReceive/CheckOrderToReceiveExistsController.ts
var CheckOrderToReceiveExistsController_exports = {};
__export(CheckOrderToReceiveExistsController_exports, {
  CheckOrderToReceiveExistsController: () => CheckOrderToReceiveExistsController
});
module.exports = __toCommonJS(CheckOrderToReceiveExistsController_exports);

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

// src/services/orderToReceive/CheckOrderToReceiveExistsService.ts
var CheckOrderToReceiveExistsService = class {
  async execute({ order_id }) {
    if (!order_id) {
      throw new BadRequestException(
        "order_id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const orderToReceive = await prisma_default.orderToReceive.findFirst({
        where: { order_id }
      });
      return { exists: !!orderToReceive };
    } catch (error) {
      console.error("[CheckOrderToReceiveExistsService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/CheckOrderToReceiveExistsController.ts
var CheckOrderToReceiveExistsController = class {
  async handle(req, res, next) {
    const { orderId } = req.params;
    const checkOrderToReceiveExistsService = new CheckOrderToReceiveExistsService();
    const result = await checkOrderToReceiveExistsService.execute({ order_id: orderId });
    return res.json(result);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CheckOrderToReceiveExistsController
});
